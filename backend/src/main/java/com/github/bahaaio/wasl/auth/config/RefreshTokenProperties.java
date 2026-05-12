package com.github.bahaaio.wasl.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Validated
@ConfigurationProperties("security.refresh")
public class RefreshTokenProperties {
    @Positive
    private int tokenByteLength = 64;

    private Duration expiresIn = Duration.ofDays(7);
}
