package com.github.bahaaio.wasl.auth.exception;

import java.time.Instant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class TokenExpiredException extends RuntimeException {
    private final Instant expiredAt;
}
