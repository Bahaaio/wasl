package com.github.bahaaio.wasl.community.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CommunityCreateRequest(
        @NotBlank
        @Size(min = 3, max = 50)
        String name,

        @NotBlank
        @Size(max = 500)
        String description,

        @NotNull
        long categoryId,

        boolean isPublic
) {
}
