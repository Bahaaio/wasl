package com.github.bahaaio.wasl.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties("security.refresh")
public class RefreshTokenProperties {
    private int size = 64;
    private int expirationDays = 7;
}
