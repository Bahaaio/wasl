package com.github.bahaaio.wasl.post.service;

import com.github.bahaaio.wasl.auth.exception.ForbiddenException;
import com.github.bahaaio.wasl.community.model.Community;
import com.github.bahaaio.wasl.media.dto.MediaDto;
import com.github.bahaaio.wasl.media.model.MediaOwnerType;
import com.github.bahaaio.wasl.media.service.MediaService;
import com.github.bahaaio.wasl.post.dto.PostCreateRequest;
import com.github.bahaaio.wasl.post.dto.PostDto;
import com.github.bahaaio.wasl.post.dto.PostPatchRequest;
import com.github.bahaaio.wasl.post.exception.PostNotFoundException;
import com.github.bahaaio.wasl.post.mapper.PostMapper;
import com.github.bahaaio.wasl.post.model.Post;
import com.github.bahaaio.wasl.post.repository.PostRepository;
import com.github.bahaaio.wasl.user.service.UserService;
import com.github.bahaaio.wasl.vote.model.VoteAction;
import com.github.bahaaio.wasl.vote.service.VoteService;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class PostService {
    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final MediaService mediaService;
    private final UserService userService;
    private final VoteService voteService;

    @Transactional
    public PostDto getById(Long id, @Nullable String currentUsername) {
        var post = getEntityById(id);

        var vote = VoteAction.NONE;
        if (currentUsername != null) {
            voteService.getPostVoteByUsername(id, currentUsername);
        }

        return postMapper.toDto(post, getMediaById(id), vote);
    }

    public Post getEntityById(Long id) {
        return postRepository.findById(id)
            .orElseThrow(() -> new PostNotFoundException(id));
    }

    public List<MediaDto> getMediaById(Long id) {
        return mediaService.getByOwnerId(id, MediaOwnerType.POST);
    }

    public PagedModel<PostDto> listByUsername(String username, Pageable pageable, @Nullable String currentUserName) {
        // TODO: n+1
        var dtoPage = postRepository.findAllByAuthor_Username(username, pageable)
            .map(post -> {
                var vote = VoteAction.NONE;
                if (currentUserName != null) vote = voteService.getPostVoteByUsername(post.getId(), currentUserName);

                return postMapper.toDto(post, getMediaById(post.getId()), vote);
            });

        return new PagedModel<>(dtoPage);
    }

    @Transactional
    public PostDto create(PostCreateRequest request, String username) {
        var author = userService.getEntityByUsername(username);
        // TODO: use community service
        Community community = null;

        var created = postRepository.save(
            Post.builder()
                .title(request.title())
                .content(request.content())
                .author(author)
                .community(community)
                .build()
        );

        var media = request.mediaIds().stream()
            .map(id -> mediaService.attachMedia(
                id,
                MediaOwnerType.POST,
                created.getId(),
                username,
                request.mediaIds().indexOf(id)
            ))
            .toList();

        return postMapper.toDto(created, media, VoteAction.NONE);
    }

    @Transactional
    public PostDto patchById(Long id, PostPatchRequest request, String username) {
//        var user = userService.getEntityByUsername(username);
        var post = getEntityById(id);

        // TODO: check if user is moderator from membership service
        if (!post.getAuthor().getUsername().equals(username)) {
            throw new ForbiddenException();
        }

        if (StringUtils.isNotBlank(request.title())) post.setTitle(request.title());
        if (StringUtils.isNotBlank(request.content())) post.setContent(request.content());

        var postMedia = getMediaById(id);

        if (request.mediaIds() != null) {
            var oldMediaIds = postMedia.stream()
                .map(MediaDto::id)
                .collect(Collectors.toSet());

            var mediaIdsToBeRemoved = new HashSet<>(oldMediaIds);
            mediaIdsToBeRemoved.removeAll(new HashSet<>(request.mediaIds()));

            mediaIdsToBeRemoved.forEach(mediaService::deleteMediaById);

            postMedia = request.mediaIds().stream()
                .map(mediaId -> attachOrRepositionPost(
                    mediaId,
                    request.mediaIds().indexOf(mediaId),
                    oldMediaIds,
                    post.getId(),
                    username
                ))
                .toList();
        }

        return postMapper.toDto(post, postMedia, VoteAction.NONE);
    }

    @Transactional
    public void deleteById(Long id, String username) {
//        var user = userService.getEntityByUsername(username);
        var post = getEntityById(id);

        // TODO: check if user is moderator from membership service
        if (!post.getAuthor().getUsername().equals(username)) {
            throw new ForbiddenException();
        }

        // TODO: soft delete
        mediaService.deleteMediaByOwnerId(id, MediaOwnerType.POST);
        postRepository.deleteById(id);
    }

    private MediaDto attachOrRepositionPost(
        UUID mediaId,
        int position,
        Set<UUID> oldMediaIds,
        Long postId,
        String username
    ) {
        if (oldMediaIds.contains(mediaId)) {
            return mediaService.updatePosition(mediaId, position);
        }

        return mediaService.attachMedia(mediaId, MediaOwnerType.POST, postId, username, position);
    }
}
