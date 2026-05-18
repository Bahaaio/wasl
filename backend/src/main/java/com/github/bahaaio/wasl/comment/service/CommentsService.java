package com.github.bahaaio.wasl.comment.service;

import com.github.bahaaio.wasl.auth.exception.ForbiddenException;
import com.github.bahaaio.wasl.comment.dto.CommentCreateRequest;
import com.github.bahaaio.wasl.comment.dto.CommentDto;
import com.github.bahaaio.wasl.comment.dto.CommentFeedResponse;
import com.github.bahaaio.wasl.comment.dto.CommentPatchRequest;
import com.github.bahaaio.wasl.comment.exception.CommentNotFoundException;
import com.github.bahaaio.wasl.comment.exception.CommentParentNotFoundException;
import com.github.bahaaio.wasl.comment.model.Comment;
import com.github.bahaaio.wasl.comment.repository.CommentRepository;
import com.github.bahaaio.wasl.community.service.CommunityMembershipService;
import com.github.bahaaio.wasl.media.dto.MediaDto;
import com.github.bahaaio.wasl.media.model.MediaOwnerType;
import com.github.bahaaio.wasl.media.service.MediaService;
import com.github.bahaaio.wasl.post.repository.PostRepository;
import com.github.bahaaio.wasl.post.service.PostService;
import com.github.bahaaio.wasl.user.service.UserService;
import com.github.bahaaio.wasl.vote.model.VoteAction;
import com.github.bahaaio.wasl.vote.service.VoteService;

import org.apache.commons.lang3.StringUtils;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CommentsService {
    public static final int MAX_DEPTH = 8;

    private final CommentRepository commentRepository;
    private final UserService userService;
    private final PostService postService;
    private final MediaService mediaService;
    private final VoteService voteService;
    private final PostRepository postRepository;
    private final CommunityMembershipService communityMembershipService;

    @Transactional
    public PagedModel<CommentDto> search(
        String query,
        @Nullable String communityName,
        @Nullable Instant after,
        Pageable pageable
    ) {
        var comments = commentRepository.searchComments(query, communityName, after, pageable)
            .map(comment -> {
                var media = getMediaById(comment.getId());
                return toDto(comment, comment.getPost().getId(), media, VoteAction.NONE);
            });

        return new PagedModel<>(comments);
    }

    @Transactional
    public CommentDto getById(Long id, String username) {
        var comment = getEntityById(id);
        var media = getMediaById(id);

        var vote = VoteAction.NONE;
        if (username != null) {
            vote = voteService.getCommentVoteByUsername(id, username);
        }

        return toDto(comment, comment.getPost().getId(), media, vote);
    }

    public Comment getEntityById(Long id) {
        return commentRepository.findById(id)
            .orElseThrow(() -> new CommentNotFoundException(id));
    }

    @Transactional
    public PagedModel<CommentDto> listByUsername(String username, Pageable pageable, String currentUsername) {
        var comments = commentRepository.findAllByAuthor_Username(username, pageable)
            .map(comment -> {
                var vote = VoteAction.NONE;
                if (currentUsername != null) {
                    vote = voteService.getCommentVoteByUsername(comment.getId(), currentUsername);
                }

                return toDto(comment, comment.getPost().getId(), getMediaById(comment.getId()), vote);
            });

        return new PagedModel<>(comments);
    }

    @Transactional
    public CommentDto reply(Long postId, CommentCreateRequest request, String username) {
        var post = postService.getEntityById(postId);
        // check is community member
        var commentAuthor = userService.getEntityByUsername(username);

        Comment parent = null;
        if (request.parentId() != null) {
            parent = commentRepository.findById(request.parentId())
                .orElseThrow(() -> new CommentParentNotFoundException(request.parentId()));
        }

        var comment = commentRepository.save(
            Comment.builder()
                .content(request.content())
                .author(commentAuthor)
                .post(post)
                .parent(parent)
                .build()
        );

        postRepository.adjustCommentCount(post.getId(), 1);

        MediaDto media = null;
        if (request.mediaId() != null) {
            media = mediaService.attachMedia(request.mediaId(), MediaOwnerType.COMMENT, comment.getId(), username);
        }

        return toDto(comment, postId, media, VoteAction.NONE);
    }

    @Transactional
    public CommentFeedResponse listByPostId(Long postId, Pageable pageable, @Nullable String username) {
        Page<Comment> rootComments = commentRepository.findAllByPost_IdAndParentIsNull(postId, pageable);
        List<CommentDto> allComments = new ArrayList<>();

        rootComments.forEach(comment -> flattenAndMap(comment, postId, username, allComments, 0));

        return CommentFeedResponse.of(allComments, rootComments);
    }

    @Transactional
    public CommentDto patchById(Long id, CommentPatchRequest request, @Nullable String username) {
        var comment = commentRepository.findById(id)
            .orElseThrow(() -> new CommentNotFoundException(id));

        validateAuthorOrModerator(username, comment);

        if (StringUtils.isNotBlank(request.content())) comment.setContent(request.content());

        MediaDto media = getMediaById(id);

        if (request.mediaId() != null) {
            if (media != null) mediaService.deleteMediaById(media.id());
            media = mediaService.attachMedia(request.mediaId(), MediaOwnerType.COMMENT, id, username);
        }

        var vote = voteService.getCommentVoteByUsername(id, username);

        return toDto(comment, comment.getPost().getId(), media, vote);
    }

    @Transactional
    public void deleteById(Long id, String username) {
        var comment = getEntityById(id);
        validateAuthorOrModerator(username, comment);

        postRepository.adjustCommentCount(comment.getPost().getId(), -1);

        // TODO: soft delete
        mediaService.deleteMediaByOwnerId(id, MediaOwnerType.COMMENT);
        commentRepository.deleteById(id);
    }

    private @Nullable MediaDto getMediaById(Long commentId) {
        var mediaList = mediaService.getByOwnerId(commentId, MediaOwnerType.COMMENT);
        return mediaList.isEmpty() ? null : mediaList.getFirst();
    }

    private void flattenAndMap(Comment comment, Long postId, String username, List<CommentDto> allComments, int depth) {
        var vote = VoteAction.NONE;
        if (username != null) {
            // TODO: crazy N+1
            vote = voteService.getCommentVoteByUsername(comment.getId(), username);
        }

        // TODO: crazy N+1
        MediaDto media = getMediaById(comment.getId());
        var dto = toDto(comment, postId, media, vote);
        allComments.add(dto);

        if (depth < MAX_DEPTH) {
            comment.getReplies().forEach(reply ->
                flattenAndMap(reply, postId, username, allComments, depth + 1)
            );
        } else {
            dto.setHasMoreReplies(!comment.getReplies().isEmpty());
        }
    }

    private void validateAuthorOrModerator(String username, Comment comment) {
        var communityName = comment.getPost().getCommunity().getName();

        if (!comment.getAuthor().getUsername().equals(username) &&
            !communityMembershipService.isOwnerOrModerator(communityName, username)) {
            throw new ForbiddenException();
        }
    }

    private CommentDto toDto(Comment comment, Long postId, MediaDto mediaDto, VoteAction vote) {
        var author = comment.getAuthor();
        var parentId = comment.getParent() != null ? comment.getParent().getId() : null;

        return CommentDto.builder()
            .id(comment.getId())
            .content(comment.getContent())

            .authorUsername(author.getUsername())
            .authorAvatarMediaId(author.getAvatarMediaId())

            .parentId(parentId)
            .postId(postId)
            .media(mediaDto)

            .vote(vote)
            .score(comment.getScore())
            .deleted(comment.isDeleted())

            .createdAt(comment.getCreatedAt())
            .build();
    }
}
