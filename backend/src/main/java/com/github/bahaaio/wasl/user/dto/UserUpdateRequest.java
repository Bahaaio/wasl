package com.github.bahaaio.wasl.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
    @NotBlank
    @Size(max = 512)
    String about
) {
}
