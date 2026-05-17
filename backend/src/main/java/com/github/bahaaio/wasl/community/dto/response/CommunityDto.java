package com.github.bahaaio.wasl.community.dto.response;

import lombok.Builder;

import java.time.Instant;

@Builder
public record CommunityDto(
        long id,
        String name,
        String description,

        Long categoryId,
        String categoryName,

        long subscribersCount,
        Boolean isPublic,
        Instant createdAt
) {
}
