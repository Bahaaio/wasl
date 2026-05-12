package com.github.bahaaio.wasl.media.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.unit.DataSize;
import org.springframework.validation.annotation.Validated;

import java.util.Set;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "media")
public class MediaProperties {
    @NotEmpty
    private Set<String> allowedTypes;

    private DataSize maxImageSize;
    private DataSize maxGifSize;
    private DataSize maxVideoSize;
}
