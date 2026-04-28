package com.github.bahaaio.wasl.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError<List<ValidationErrorDetail>>> handleValidationErrors(MethodArgumentNotValidException ex) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
            .map(err -> new ValidationErrorDetail(err.getField(), err.getDefaultMessage()))
            .toList();

        return ResponseEntity.badRequest().body(
            ApiError.<List<ValidationErrorDetail>>builder()
                .code("VALIDATION_ERROR")
                .message("Validation failed")
                .details(errors)
                .build()
        );
    }
}
