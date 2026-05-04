package com.github.bahaaio.wasl.post.exception;

import com.github.bahaaio.wasl.exception.ApiError;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class PostsExceptionHandler {
    @ExceptionHandler(PostNotFoundException.class)
    public ResponseEntity<ApiError<Void>> handlePostNotFoundException(PostNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ApiError.of("POST_NOT_FOUND", "Post with id: " + ex.getId() + " not found")
        );
    }
}
