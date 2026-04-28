package com.github.bahaaio.wasl.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Validated
@ConfigurationProperties("security.jwt")
public class JwtTokenProperties {
    @NotBlank
    private String secret;

    @Positive
    private long expirationMs;
}
