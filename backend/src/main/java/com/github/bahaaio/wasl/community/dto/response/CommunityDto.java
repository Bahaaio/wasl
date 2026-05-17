package com.github.bahaaio.wasl.community.dto.response;

import java.time.Instant;
import java.util.UUID;

import lombok.Builder;

@Builder
public record CommunityDto(
    long id,
    String name,
    String description,

    Long categoryId,
    String categoryName,

    UUID iconMediaId,
    UUID bannerMediaId,

    long subscribersCount,
    boolean isPublic,
    Instant createdAt
) {
}
