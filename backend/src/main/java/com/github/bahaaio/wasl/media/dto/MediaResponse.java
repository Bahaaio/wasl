package com.github.bahaaio.wasl.media.dto;

import com.github.bahaaio.wasl.media.model.MediaType;

import java.util.UUID;

import lombok.Builder;

@Builder
public record MediaResponse(
    UUID id,
    MediaType type,
    String fullUrl,
    String previewUrl
) {
}
