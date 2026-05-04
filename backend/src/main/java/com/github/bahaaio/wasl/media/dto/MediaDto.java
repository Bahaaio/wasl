package com.github.bahaaio.wasl.media.dto;

import com.github.bahaaio.wasl.media.model.MediaType;

import java.util.UUID;

public record MediaDto(
    UUID id,
    MediaType type
) {
}
