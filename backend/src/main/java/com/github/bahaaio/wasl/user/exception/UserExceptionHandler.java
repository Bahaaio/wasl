package com.github.bahaaio.wasl.user.exception;

import com.github.bahaaio.wasl.exception.ApiError;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class UserExceptionHandler {
    @ExceptionHandler
    public ResponseEntity<ApiError<Void>> handleUsernameNotFound(UsernameNotFoundException ex) {
        return ResponseEntity.badRequest().body(
            ApiError.of("USERNAME_NOT_FOUND", ex.getMessage())
        );
    }
}
