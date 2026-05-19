package com.github.bahaaio.wasl.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError<List<ValidationErrorDetail>>> handleValidationErrors(MethodArgumentNotValidException ex) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
            .map(err -> new ValidationErrorDetail(err.getField(), err.getDefaultMessage()))
            .toList();

        return ResponseEntity.badRequest().body(
            ApiError.of("VALIDATION_ERROR", "Validation failed", errors)
        );
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiError<Map<String, String>>> handleMissingRequestParameter(MissingServletRequestParameterException ex) {
        return ResponseEntity.badRequest().body(
            ApiError.of(
                "MISSING_QUERY_PARAMTER",
                "Missing required query parameter",
                Map.of("parameter", ex.getParameterName())
            )
        );
    }

    @ExceptionHandler(ResourceGoneException.class)
    public ResponseEntity<ApiError<Void>> handleResourceGone(ResourceGoneException ex) {
        return ResponseEntity.status(HttpStatus.GONE).body(
            ApiError.of("RESOURCE_GONE", ex.getMessage())
        );
    }

//    @ExceptionHandler(RuntimeException.class)
//    public ResponseEntity<ApiError<Void>> handleAll() {
//        return ResponseEntity.internalServerError().body(
//            ApiError.of("INTERNAL_SERVER_ERROR", "Something went wrong")
//        );
//    }
}
