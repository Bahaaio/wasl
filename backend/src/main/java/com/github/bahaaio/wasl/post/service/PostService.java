package com.github.bahaaio.wasl.post.service;

import com.github.bahaaio.wasl.auth.exception.ForbiddenException;
import com.github.bahaaio.wasl.community.model.Community;
import com.github.bahaaio.wasl.media.dto.MediaDto;
import com.github.bahaaio.wasl.media.model.MediaOwnerType;
import com.github.bahaaio.wasl.media.service.MediaService;
import com.github.bahaaio.wasl.post.dto.PostCreateRequest;
import com.github.bahaaio.wasl.post.dto.PostDto;
import com.github.bahaaio.wasl.post.exception.PostNotFoundException;
import com.github.bahaaio.wasl.post.model.Post;
import com.github.bahaaio.wasl.post.repository.PostRepository;
import com.github.bahaaio.wasl.user.service.UserService;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class PostService {
    private final PostRepository postRepository;
    private final MediaService mediaService;
    private final UserService userService;

    @Transactional
    public PostDto getById(Long id) {
        var post = getEntityById(id);

        // TODO: join with media
        var media = mediaService.getByOwnerId(post.getId(), MediaOwnerType.POST);

        return toPostDto(post, media);
    }

    public Post getEntityById(Long id) {
        return postRepository.findById(id)
            .orElseThrow(() -> new PostNotFoundException(id));
    }

    public PagedModel<PostDto> listByUsername(String username, Pageable pageable) {
        // TODO: n+1
        var dtoPage = postRepository.findAllByAuthor_Username(username, pageable).map(post -> {
            var media = mediaService.getByOwnerId(post.getId(), MediaOwnerType.POST);
            return toPostDto(post, media);
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
            .map(id -> mediaService.attachMedia(id, MediaOwnerType.POST, created.getId(), username))
            .toList();

        return toPostDto(created, media);
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

    private PostDto toPostDto(Post post, List<MediaDto> media) {
        var author = post.getAuthor();
        var community = post.getCommunity();

        return PostDto.builder()
            .id(post.getId())
            .title(post.getTitle())
            .content(post.getContent())

            .authorUsername(author.getUsername())
            .authorAvatarMediaId(author.getAvatarMediaId())

            .communityId(community.getId())
            .communityName(community.getName())

            .media(media)

            .userVote(0) // TODO: fetch user vote
            .score(post.getScore())
            .commentCount(post.getCommentCount())
            .createdAt(post.getCreatedAt())
            .build();
    }
}
