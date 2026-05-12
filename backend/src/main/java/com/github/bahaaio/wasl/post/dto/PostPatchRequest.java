package com.github.bahaaio.wasl.post.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.Size;

public record PostPatchRequest(
    @Size(min = 3, max = 255)
    String title,

    @Size(min = 3, max = 10000)
    String content,

    @Size(max = 10)
    List<UUID> mediaIds
) {
}
