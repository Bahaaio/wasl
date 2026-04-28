package com.github.bahaaio.wasl.auth.model;

import com.github.bahaaio.wasl.user.dto.UserDto;

public record AuthResult(
    String accessToken,
    String refreshToken,
    UserDto userDto
) {
}
