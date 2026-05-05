package com.github.bahaaio.wasl.community.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommunityCategoryCreateRequest(
        @NotBlank
        @Size(min = 2, max = 50)
        String name
) {
}
