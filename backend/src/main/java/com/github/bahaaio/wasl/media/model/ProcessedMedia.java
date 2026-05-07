package com.github.bahaaio.wasl.media.model;

import java.io.InputStream;

public record ProcessedMedia(
    InputStream fullStream,
    InputStream thumbnailStream
) {
}
