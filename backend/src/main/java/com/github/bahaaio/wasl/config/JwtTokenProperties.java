package com.github.bahaaio.wasl.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties("security.jwt")
public class JwtTokenProperties {
    private String secret;
    private long expirationMs;
}
