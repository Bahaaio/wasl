package com.github.bahaaio.wasl.post.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PostCreateRequest(
    @NotBlank
    @Size(min = 3, max = 255)
    String title,

    @NotBlank
    @Size(min = 3, max = 10000)
    String content,

    @NotNull
    Long communityId,

    @Size(max = 10)
    List<UUID> mediaIds
) {
}
