package com.github.bahaaio.wasl.user.dto;

import java.time.Instant;

import lombok.Builder;

@Builder
public record UserDto(
    String username,
    String email,
    String about,
    String avatarUrl,
    String bannerUrl,
    Instant createdAt
) {
}
