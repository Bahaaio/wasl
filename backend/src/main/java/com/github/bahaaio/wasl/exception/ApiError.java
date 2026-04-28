package com.github.bahaaio.wasl.exception;

public record ApiError<T>(
    String code,
    String message,
    T details
) {
    public static <T> ApiError<T> of(String code, String message, T details) {
        return new ApiError<>(code, message, details);
    }

    public static ApiError<Void> of(String code, String message) {
        return new ApiError<>(code, message, null);
    }
}
