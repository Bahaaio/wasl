package com.github.bahaaio.wasl.storage.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@Validated
@ConfigurationProperties("storage")
public class StorageProperties {

    @NonNull
    private StorageType type = StorageType.local;

    private Local local = new Local();
    private S3 s3 = new S3();

    @Getter
    @Setter
    public static class Local {
        private String location = "upload";
    }

    @Getter
    @Setter
    public static class S3 {
        private String bucket;
        private String region;
        private String endpoint;
    }
}

enum StorageType {
    local,
    s3
}
