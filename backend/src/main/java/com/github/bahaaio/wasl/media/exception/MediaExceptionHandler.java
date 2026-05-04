package com.github.bahaaio.wasl.media.exception;

import com.github.bahaaio.wasl.exception.ApiError;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class MediaExceptionHandler {
    @ExceptionHandler(FileNotFoundException.class)
    public ResponseEntity<ApiError<Void>> handleFileNotFound(FileNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ApiError.of("FILE_NOT_FOUND", ex.getMessage())
        );
    }

    @ExceptionHandler(StorageException.class)
    public ResponseEntity<ApiError<Void>> handleStorageException() {
        return ResponseEntity.badRequest().body(
            ApiError.of("STORAGE_FAILURE", "Something went wrong while storing the file")
        );
    }

    @ExceptionHandler(UnsupportedMediaTypeException.class)
    public ResponseEntity<ApiError<Void>> handleUnsupportedMediaTypeException(UnsupportedMediaTypeException ex) {
        return ResponseEntity.badRequest().body(
            ApiError.of("UNSUPPORTED_MEDIA_TYPE", "Unsupported media type: " + ex.getMessage())
        );
    }
}
