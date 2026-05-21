package com.github.bahaaio.wasl.storage.service;

import com.github.bahaaio.wasl.storage.config.StorageProperties;
import com.github.bahaaio.wasl.storage.exception.StorageException;
import com.github.bahaaio.wasl.storage.exception.StorageFileNotFoundException;
import com.github.bahaaio.wasl.storage.model.StorageFile;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

@ConditionalOnProperty(value = "storage.type", havingValue = "s3")
@RequiredArgsConstructor
@Service
public class S3StorageService implements StorageService {
    private final StorageProperties storageProperties;
    private final S3Client s3Client;

    @Override
    public void store(StorageFile mediaFile, String key) {
        var request = PutObjectRequest.builder()
            .bucket(storageProperties.getS3().getBucket())
            .key(key)
            .contentType(mediaFile.mimeType())
            .build();

        s3Client.putObject(
            request,
            RequestBody.fromInputStream(mediaFile.inputStream(), mediaFile.size())
        );
    }

    @Override
    public Resource load(String key) {
        try {
            var request = GetObjectRequest.builder()
                .bucket(storageProperties.getS3().getBucket())
                .key(key)
                .build();

            var response = s3Client.getObject(request);
            return new InputStreamResource(response);
        } catch (NoSuchKeyException ex) {
            throw new StorageFileNotFoundException("File not found: " + key);
        } catch (S3Exception ex) {
            throw new StorageException("Failed to load file: " + key, ex);
        }
    }

    @Override
    public void delete(String key) {
        try {
            var request = DeleteObjectRequest.builder()
                .bucket(storageProperties.getS3().getBucket())
                .key(key)
                .build();

            s3Client.deleteObject(request);
        } catch (S3Exception ex) {
            throw new StorageException("Failed to delete file: " + key, ex);
        }
    }
}
