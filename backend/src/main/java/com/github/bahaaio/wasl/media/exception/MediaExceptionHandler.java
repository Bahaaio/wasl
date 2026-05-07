package com.github.bahaaio.wasl.media.exception;

import com.github.bahaaio.wasl.exception.ApiError;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class MediaExceptionHandler {
    @ExceptionHandler(UnsupportedMediaTypeException.class)
    public ResponseEntity<ApiError<Void>> handleUnsupportedMediaTypeException(UnsupportedMediaTypeException ex) {
        return ResponseEntity.badRequest().body(
            ApiError.of("UNSUPPORTED_MEDIA_TYPE", "Unsupported media type: " + ex.getMessage())
        );
    }

    @ExceptionHandler(MediaAlreadyAttachedException.class)
    public ResponseEntity<ApiError<Void>> handleMediaAlreadyAttachedException(MediaAlreadyAttachedException ex) {
        return ResponseEntity.badRequest().body(
            ApiError.of("MEDIA_ALREADY_ATTACHED", "Media with id: " + ex.getId() + "already attached")
        );
    }
}
