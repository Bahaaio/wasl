package com.github.bahaaio.wasl.auth.dto;

import com.github.bahaaio.wasl.user.dto.UserDto;

public record AuthResponse(
    String accessToken,
    UserDto user
) {
}
