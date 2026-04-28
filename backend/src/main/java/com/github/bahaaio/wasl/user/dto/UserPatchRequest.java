package com.github.bahaaio.wasl.user.dto;

import jakarta.validation.constraints.Size;

public record UserPatchRequest(
    @Size(max = 512)
    String about
) {
}
