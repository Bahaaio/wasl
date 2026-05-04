package com.github.bahaaio.wasl.post.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PostNotFoundException extends RuntimeException {
    private final Long id;
}
