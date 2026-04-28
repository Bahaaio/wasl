package com.github.bahaaio.wasl.auth.exception;

import com.github.bahaaio.wasl.exception.ApiError;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class AuthExceptionHandler {
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiError<Void>> handleConflictException(ConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
            ApiError.of("AUTH_CONFLICT", ex.getMessage())
        );
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiError<Void>> handleInvalidCredentials() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            ApiError.of("INVALID_CREDENTIALS", "Invalid username or password")
        );
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ApiError<Map<String, String>>> handleInvalidToken(InvalidTokenException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            ApiError.of(
                "INVALID_TOKEN",
                "Invalid token",
                Map.of("reason", ex.getMessage())
            )
        );
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ApiError<Map<String, Object>>> handleTokenExpired(TokenExpiredException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            ApiError.of(
                "TOKEN_EXPIRED",
                "Token has expired",
                Map.of("expiredAt", ex.getExpiredAt().toString())
            )
        );
    }
}
