package com.github.bahaaio.wasl.storage.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.URI;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@ConditionalOnProperty(value = "storage.type", havingValue = "s3")
@RequiredArgsConstructor
@Configuration
public class S3Config {
    private final StorageProperties storageProperties;

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
            .region(Region.of(storageProperties.getS3().getRegion()))
            .endpointOverride(URI.create(storageProperties.getS3().getEndpoint()))
            .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
            .forcePathStyle(true)
            .build();
    }
}
