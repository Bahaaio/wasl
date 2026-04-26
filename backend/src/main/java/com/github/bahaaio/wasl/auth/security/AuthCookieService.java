package com.github.bahaaio.wasl.auth.security;

import com.github.bahaaio.wasl.config.RefreshTokenProperties;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AuthCookieService {
    public static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
    private final RefreshTokenProperties refreshProperties;

    public ResponseCookie createRefreshTokenCookie(String token) {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, token)
            .httpOnly(true)
            .path("/api/v1/auth")
            .maxAge(Duration.ofDays(refreshProperties.getExpirationDays()))
            .sameSite("Strict")
            .build();
    }

    public ResponseCookie deleteRefreshTokenCookie() {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, "")
            .httpOnly(true)
            .path("/api/v1/auth")
            .maxAge(0)
            .build();
    }
}
