package com.github.bahaaio.wasl.feed.service;

import com.github.bahaaio.wasl.feed.dto.PostFeedResponse;
import com.github.bahaaio.wasl.feed.model.FeedSort;
import com.github.bahaaio.wasl.media.model.MediaOwnerType;
import com.github.bahaaio.wasl.media.service.MediaService;
import com.github.bahaaio.wasl.post.dto.PostDto;
import com.github.bahaaio.wasl.post.mapper.PostMapper;
import com.github.bahaaio.wasl.post.repository.PostRepository;
import com.github.bahaaio.wasl.vote.model.VoteAction;
import com.github.bahaaio.wasl.vote.service.VoteService;

import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class FeedService {
    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final MediaService mediaService;
    private final VoteService voteService;

    public PostFeedResponse getFeed(
        @Nullable String currentUsername,
        FeedSort sort,
        @Nullable Instant cursorCreatedAt,
        @Nullable Long cursorId,
        @Nullable Long cursorScore,
        Pageable pageable
    ) {
        var page = switch (sort) {
            case latest -> currentUsername == null
                ? postRepository.findPublicFeedLatest(cursorCreatedAt, cursorId, pageable)
                : postRepository.findSubscribedFeedLatest(currentUsername, cursorCreatedAt, cursorId, pageable);
            case top -> currentUsername == null
                ? postRepository.findPublicFeedTop(cursorScore, cursorId, pageable)
                : postRepository.findSubscribedFeedTop(currentUsername, cursorScore, cursorId, pageable);
            case hot -> currentUsername == null
                ? postRepository.findPublicFeedHot(cursorScore, cursorCreatedAt, cursorId, pageable)
                : postRepository.findSubscribedFeedHot(currentUsername, cursorScore, cursorCreatedAt, cursorId, pageable);
        };

        List<PostDto> posts = page.stream()
            .map(post -> postMapper.toDto(
                post,
                mediaService.getByOwnerId(post.getId(), MediaOwnerType.POST),
                currentUsername == null ? VoteAction.NONE : voteService.getPostVoteByUsername(post.getId(), currentUsername)
            ))
            .toList();

        return PostFeedResponse.of(posts, page.hasNext());
    }

    
}
