package com.github.bahaaio.wasl.exception;

import lombok.Builder;

@Builder
public record ApiError<T>(
    String code,
    String message,
    T details
) {
}
