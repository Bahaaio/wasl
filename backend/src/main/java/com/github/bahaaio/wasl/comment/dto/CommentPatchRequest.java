package com.github.bahaaio.wasl.comment.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentPatchRequest(
    @NotBlank
    @Size(min = 1, max = 512)
    String content,

    UUID mediaId
) {
}
