package com.github.bahaaio.wasl.community.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CommunityPatchRequest(
        @NotBlank
        @Size(max = 500)
        String description,

        @NotNull
        Long categoryId,

        boolean isPublic
) {
}
