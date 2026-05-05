package com.github.bahaaio.wasl.community.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CommunityNotFoundException extends RuntimeException {
    private final Long id;
}
