package com.github.bahaaio.wasl.comment.service;

import com.github.bahaaio.wasl.auth.exception.ForbiddenException;
import com.github.bahaaio.wasl.comment.dto.CommentCreateRequest;
import com.github.bahaaio.wasl.comment.dto.CommentDto;
import com.github.bahaaio.wasl.comment.dto.CommentFeedResponse;
import com.github.bahaaio.wasl.comment.dto.CommentPatchRequest;
import com.github.bahaaio.wasl.comment.exception.CommentNotFound;
import com.github.bahaaio.wasl.comment.model.Comment;
import com.github.bahaaio.wasl.comment.repository.CommentRepository;
import com.github.bahaaio.wasl.media.dto.MediaDto;
import com.github.bahaaio.wasl.media.model.MediaOwnerType;
import com.github.bahaaio.wasl.media.service.MediaService;
import com.github.bahaaio.wasl.post.service.PostService;
import com.github.bahaaio.wasl.user.service.UserService;
import com.github.bahaaio.wasl.vote.model.VoteAction;
import com.github.bahaaio.wasl.vote.service.VoteService;

import org.apache.commons.lang3.StringUtils;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
            .orElseThrow(() -> new CommentNotFound(id));
    }

    @Transactional
    public CommentDto reply(Long postId, CommentCreateRequest request, String username) {
        var post = postService.getEntityById(postId);
        // check is community member
        var commentAuthor = userService.getEntityByUsername(username);

        Comment parent = null;
        if (request.parentId() != null) {
            parent = getEntityById(request.parentId());
        }

        var comment = commentRepository.save(
            Comment.builder()
                .content(request.content())
                .author(commentAuthor)
                .post(post)
                .parent(parent)
                .build()
        );

        MediaDto media = null;
        if (request.mediaId() != null) {
            media = mediaService.attachMedia(request.mediaId(), MediaOwnerType.COMMENT, comment.getId(), username);
        }

        return toDto(comment, postId, media, VoteAction.NONE);
    }

    @Transactional
    public CommentFeedResponse listByPostId(Long postId, Pageable pageable, String username) {
        Page<Comment> rootComments = commentRepository.findAllByPost_IdAndParentIsNull(postId, pageable);
        List<CommentDto> allComments = new ArrayList<>();

        rootComments.forEach(comment -> flattenAndMap(comment, postId, username, allComments, 0));

        return CommentFeedResponse.of(allComments, rootComments);
    }

    @Transactional
    public CommentDto patchById(Long id, CommentPatchRequest request, @Nullable String username) {
        var comment = commentRepository.findById(id)
            .orElseThrow(() -> new CommentNotFound(id));

        // TODO: check if moderator
        if (!comment.getAuthor().getUsername().equals(username)) {
            throw new ForbiddenException();
        }

        if (StringUtils.isNotBlank(request.content())) comment.setContent(request.content());

        MediaDto media = getMediaById(id);

        if (request.mediaId() != null) {
            mediaService.deleteMediaById(media.id());
            media = mediaService.attachMedia(request.mediaId(), MediaOwnerType.COMMENT, id, username);
        }

        var vote = voteService.getCommentVoteByUsername(id, username);

        return toDto(comment, comment.getPost().getId(), media, vote);
    }

    @Transactional
    public void deleteById(Long id, String username) {
//        var user = userService.getEntityByUsername(username);
        var comment = getEntityById(id);

        // TODO: check if user is moderator from membership service
        if (!comment.getAuthor().getUsername().equals(username)) {
            throw new ForbiddenException();
        }

        // TODO: soft delete
        mediaService.deleteMediaByOwnerId(id, MediaOwnerType.COMMENT);
        commentRepository.deleteById(id);
    }

    private MediaDto getMediaById(Long commentId) {
        return mediaService.getByOwnerId(commentId, MediaOwnerType.COMMENT).getFirst();
    }

    private void flattenAndMap(Comment comment, Long postId, String username, List<CommentDto> allComments, int depth) {
        var vote = VoteAction.NONE;
        if (username != null) {
            // TODO: crazy N+1
            vote = voteService.getCommentVoteByUsername(comment.getId(), username);
        }

        // TODO: crazy N+1
        MediaDto media = getMediaById(comment);
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

    private MediaDto getMediaById(Comment comment) {
        return getMediaById(comment.getId());
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
