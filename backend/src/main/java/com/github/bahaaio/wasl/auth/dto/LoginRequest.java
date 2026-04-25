package com.github.bahaaio.wasl.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LoginRequest(
    @NotBlank
    @Pattern(regexp = "^\\w{3,30}$")
    String username,

    @NotBlank
    @Size(min = 8, max = 30)
    String password
) {
}
