package com.github.bahaaio.wasl.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Validated
@ConfigurationProperties("security.jwt")
public class JwtTokenProperties {
    @NotBlank
    private String secret;

    private Duration expiresIn;
}
