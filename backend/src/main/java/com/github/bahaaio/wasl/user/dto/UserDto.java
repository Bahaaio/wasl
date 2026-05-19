package com.github.bahaaio.wasl.user.dto;

import java.time.Instant;
import java.util.UUID;

import lombok.Builder;

@Builder
public record UserDto(
    String username,
    String about,
    UUID avatarMediaId,
    UUID bannerMediaId,
    boolean deleted,
    Instant createdAt
) {
}
