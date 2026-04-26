package com.github.bahaaio.wasl.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Validated
@ConfigurationProperties("security.refresh")
public class RefreshTokenProperties {
    @Positive
    private int size = 64;

    @Positive
    private int expirationDays = 7;
}
