package com.github.bahaaio.wasl.media.dto;

import org.springframework.core.io.Resource;

public record MediaFileResponse(
    Resource file,
    String mimeType
) {
}
