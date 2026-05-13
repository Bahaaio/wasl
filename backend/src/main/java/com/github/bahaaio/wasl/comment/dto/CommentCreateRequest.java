package com.github.bahaaio.wasl.comment.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;

public record CommentCreateRequest(
    @NotBlank
    String content,

    // parent comment id
    // null if it is a top-level comment
    Long parentId,

    UUID mediaId // optional
) {
}
