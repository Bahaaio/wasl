package com.github.bahaaio.wasl.community.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommunityPatchRequest(
    @NotBlank
    @Size(max = 512)
    String description,

    Long categoryId,

    Boolean isPublic
) {
}
