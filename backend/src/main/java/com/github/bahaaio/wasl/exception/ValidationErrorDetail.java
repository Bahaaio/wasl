package com.github.bahaaio.wasl.exception;

public record ValidationErrorDetail(
    String field,
    String message
) {
}
