package com.github.bahaaio.wasl.auth.model;

public record AuthResult(
    String accessToken,
    String refreshToken
) {
}
