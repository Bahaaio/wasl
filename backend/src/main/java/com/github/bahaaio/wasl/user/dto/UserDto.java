package com.github.bahaaio.wasl.user.dto;

import java.time.Instant;
import java.util.UUID;

import lombok.Builder;

@Builder
public record UserDto(
    String username,
    String email,
    String about,
    UUID avatarMediaId,
    UUID bannerMediaId,
    Instant createdAt
) {
}
