package com.github.bahaaio.wasl.auth.controller;

import com.github.bahaaio.wasl.auth.dto.AuthResponse;
import com.github.bahaaio.wasl.auth.dto.LoginRequest;
import com.github.bahaaio.wasl.auth.dto.RegisterRequest;
import com.github.bahaaio.wasl.auth.model.AuthResult;
import com.github.bahaaio.wasl.auth.security.AuthCookieService;
import com.github.bahaaio.wasl.auth.service.AuthService;

import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;
    private final AuthCookieService authCookieService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        var authResult = authService.register(request);
        return buildResponse(authResult);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        var authResult = authService.login(request);
        return buildResponse(authResult);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@CookieValue(AuthCookieService.REFRESH_TOKEN_COOKIE_NAME)
                                                String refreshToken) {
        var authResult = authService.refresh(refreshToken);
        return buildResponse(authResult);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@CookieValue(AuthCookieService.REFRESH_TOKEN_COOKIE_NAME) String refreshToken) {
        authService.logout(refreshToken);
        var clearRefreshCookie = authCookieService.deleteRefreshTokenCookie();

        return ResponseEntity.noContent()
            .header(HttpHeaders.SET_COOKIE, clearRefreshCookie.toString())
            .build();
    }

    private @NonNull ResponseEntity<AuthResponse> buildResponse(AuthResult authResult) {
        var refreshCookie = authCookieService.createRefreshTokenCookie(authResult.refreshToken());

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(new AuthResponse(authResult.accessToken()));
    }
}