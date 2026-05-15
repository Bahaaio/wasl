package com.github.bahaaio.wasl.comment.exception;

import com.github.bahaaio.wasl.exception.ApiError;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CommentsExceptionHandler {
    // TODO: handle exceptions
    @ExceptionHandler(CommentNotFound.class)
    public ResponseEntity<ApiError<Void>> handleCommentNotFound(CommentNotFound ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ApiError.of("COMMENT_NOT_FOUND", "Comment with id: " + ex.getId() + " not found")
        );
    }
}
