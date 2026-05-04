package com.github.bahaaio.wasl.media.exception;

import java.util.UUID;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class MediaAlreadyAttachedException extends RuntimeException {
    private final UUID id;
}
