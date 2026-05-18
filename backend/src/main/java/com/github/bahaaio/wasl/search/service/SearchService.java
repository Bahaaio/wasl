package com.github.bahaaio.wasl.search.service;

import com.github.bahaaio.wasl.comment.dto.CommentDto;
import com.github.bahaaio.wasl.comment.service.CommentsService;
import com.github.bahaaio.wasl.community.dto.response.CommunityDto;
import com.github.bahaaio.wasl.community.service.CommunityService;
import com.github.bahaaio.wasl.post.dto.PostDto;
import com.github.bahaaio.wasl.post.service.PostService;
import com.github.bahaaio.wasl.search.model.SearchTime;
import com.github.bahaaio.wasl.user.dto.UserDto;
import com.github.bahaaio.wasl.user.service.UserService;

import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class SearchService {
    private final CommunityService communityService;
    private final PostService postService;
    private final CommentsService commentsService;
    private final UserService userService;

    public PagedModel<CommunityDto> searchCommunities(String query, Pageable pageable) {
        return communityService.search(query, pageable);
    }

    public PagedModel<PostDto> searchPosts(
        String query,
        @Nullable String community,
        @Nullable SearchTime time,
        Pageable pageable
    ) {
        var after = toAfter(time);
        return postService.search(query, community, after, pageable);
    }

    public PagedModel<CommentDto> searchComments(
        String query,
        @Nullable String community,
        @Nullable SearchTime time,
        Pageable pageable
    ) {
        var after = toAfter(time);
        return commentsService.search(query, community, after, pageable);
    }

    public PagedModel<UserDto> searchUsers(String query, Pageable pageable) {
        return userService.search(query, pageable);
    }

    private @Nullable Instant toAfter(SearchTime searchTime) {
        var now = Instant.now();

        return switch (searchTime) {
            case all -> null;
            case year -> now.minus(Duration.ofDays(365));
            case month -> now.minus(Duration.ofDays(30));
            case week -> now.minus(Duration.ofDays(7));
            case day -> now.minus(Duration.ofDays(1));
            case hour -> now.minus(Duration.ofHours(1));
            case null -> null;
        };
    }
}
