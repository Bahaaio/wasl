package com.github.bahaaio.wasl.feed.dto;

import com.github.bahaaio.wasl.post.dto.PostDto;

import java.time.Instant;
import java.util.List;

public record PostFeedResponse(
    List<PostDto> posts,
    PostFeedPage page
) {
    public static PostFeedResponse of(List<PostDto> posts, boolean hasNext) {
        var last = posts.isEmpty() ? null : posts.getLast();
        var page = new PostFeedPage(
            posts.size(),
            hasNext,
            last != null ? last.createdAt() : null,
            last != null ? last.id() : null,
            last != null ? last.score() : null
        );

        return new PostFeedResponse(posts, page);
    }
}

record PostFeedPage(
    Integer size,
    Boolean hasNext,
    Instant nextCursorCreatedAt,
    Long nextCursorId,
    Long nextCursorScore
) {
}
