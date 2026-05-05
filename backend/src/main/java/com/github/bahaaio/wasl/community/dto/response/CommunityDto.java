package com.github.bahaaio.wasl.community.dto.response;

import lombok.Builder;

import java.time.Instant;

@Builder
public record CommunityDto(
        Long id,
        String name,
        String description,
        Long categoryId,
        String categoryName,
        Long subscribersCount,
        boolean isPublic,
        Instant createdAt
) {
}
