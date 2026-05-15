package com.github.bahaaio.wasl.comment.exception;

import com.github.bahaaio.wasl.exception.ApiError;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CommentsExceptionHandler {
    @ExceptionHandler(CommentNotFoundException.class)
    public ResponseEntity<ApiError<Void>> handleCommentNotFound(CommentNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ApiError.of("COMMENT_NOT_FOUND", "Comment with id: " + ex.getId() + " not found")
        );
    }

    @ExceptionHandler(CommentParentNotFoundException.class)
    public ResponseEntity<ApiError<Void>> handleParentNotFound(CommentParentNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ApiError.of("COMMENT_PARENT_NOT_FOUND", "Comment parent with id: " + ex.getId() + " not found")
        );
    }
}
