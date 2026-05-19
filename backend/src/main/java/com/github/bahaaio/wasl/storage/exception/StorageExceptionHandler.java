package com.github.bahaaio.wasl.storage.exception;

import com.github.bahaaio.wasl.exception.ApiError;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class StorageExceptionHandler {
    @ExceptionHandler(FileNotFoundException.class)
    public ResponseEntity<ApiError<Void>> handleFileNotFound(FileNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ApiError.of("FILE_NOT_FOUND", ex.getMessage())
        );
    }

    @ExceptionHandler(StorageException.class)
    public ResponseEntity<ApiError<Void>> handleStorageException(StorageException ex) {
        return ResponseEntity.badRequest().body(
            ApiError.of("STORAGE_FAILURE", ex.getMessage())
        );
    }
}
