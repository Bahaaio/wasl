package com.github.bahaaio.wasl.media.exception;

import com.github.bahaaio.wasl.media.model.MediaType;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class MediaTooLargeException extends RuntimeException {
    private final long maxSize;
    private final long providedSize;
    private final MediaType mediaType;
}
