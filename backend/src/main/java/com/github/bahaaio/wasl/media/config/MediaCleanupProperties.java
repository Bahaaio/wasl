package com.github.bahaaio.wasl.media.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "media.cleanup")
public class MediaCleanupProperties {
    /**
     * The cron expression used for periodic media cleanup tasks.
     */
    @NotBlank
    private String cron;

    /**
     * The duration for which media files will be retained before being eligible for cleanup.
     */
    private Duration retention = Duration.ofDays(1);
}
