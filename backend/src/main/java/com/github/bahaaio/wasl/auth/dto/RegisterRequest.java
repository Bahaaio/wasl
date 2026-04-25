package com.github.bahaaio.wasl.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank
    @Pattern(regexp = "^\\w{3,30}$")
    String username,

    @NotBlank
    @Email
    String email,

    @NotBlank
    @Size(min = 8, max = 30)
    String password
) {
}
