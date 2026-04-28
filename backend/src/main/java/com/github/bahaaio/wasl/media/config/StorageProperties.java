package com.github.bahaaio.wasl.media.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Validated
@ConfigurationProperties("storage")
public class StorageProperties {
    @NotBlank
    private String location = "upload";
}
