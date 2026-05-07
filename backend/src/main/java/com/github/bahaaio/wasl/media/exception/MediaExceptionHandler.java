package com.github.bahaaio.wasl.media.exception;

import com.github.bahaaio.wasl.exception.ApiError;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class MediaExceptionHandler {
    @ExceptionHandler(UnsupportedMediaTypeException.class)
    public ResponseEntity<ApiError<Void>> handleUnsupportedMediaTypeException(UnsupportedMediaTypeException ex) {
        return ResponseEntity.badRequest().body(
            ApiError.of("UNSUPPORTED_MEDIA_TYPE", "Unsupported media type: " + ex.getMessage())
        );
    }

    @ExceptionHandler(MediaTooLargeException.class)
    public ResponseEntity<ApiError<Map<String, Long>>> handleMediaTooLargeException(MediaTooLargeException ex) {
        var providedMb = ex.getProvidedSize() / (1024 * 1024);
        var maxAllowedMb = ex.getMaxSize() / (1024 * 1024);

        return ResponseEntity.status(HttpStatus.CONTENT_TOO_LARGE).body(
            ApiError.of("MEDIA_TOO_LARGE",
                "The uploaded %s is too large. Provided: %d MB, Maximum allowed: %d MB"
                    .formatted(ex.getMediaType(), providedMb, maxAllowedMb),
                Map.of(
                    "providedBytes", ex.getProvidedSize(),
                    "maxBytes", ex.getMaxSize()
                )
            )
        );
    }

    @ExceptionHandler(MediaAlreadyAttachedException.class)
    public ResponseEntity<ApiError<Void>> handleMediaAlreadyAttachedException(MediaAlreadyAttachedException ex) {
        return ResponseEntity.badRequest().body(
            ApiError.of("MEDIA_ALREADY_ATTACHED", "Media with id: " + ex.getId() + "already attached")
        );
    }
}
