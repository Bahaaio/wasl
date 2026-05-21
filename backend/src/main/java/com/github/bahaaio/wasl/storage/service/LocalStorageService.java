package com.github.bahaaio.wasl.storage.service;

import com.github.bahaaio.wasl.storage.config.StorageProperties;
import com.github.bahaaio.wasl.storage.exception.StorageException;
import com.github.bahaaio.wasl.storage.exception.StorageFileNotFoundException;
import com.github.bahaaio.wasl.storage.model.StorageFile;

import org.jspecify.annotations.NonNull;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@ConditionalOnProperty(value = "storage.type", havingValue = "local")
@Service
public class LocalStorageService implements StorageService {
    private final Path root;

    public LocalStorageService(StorageProperties storageProperties) {
        root = Paths.get(storageProperties.getLocal().getLocation()).toAbsolutePath();

        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new StorageException("Failed to create root");
        }
    }

    @Override
    public void store(StorageFile mediaFile, String key) {
        var filePath = resolve(key);

        try (var inputStream = mediaFile.inputStream()) {
            Files.createDirectories(filePath.getParent());
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new StorageException("Failed to store file", e);
        }
    }

    @Override
    public Resource load(String key) {
        var file = resolve(key);

        try {
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new StorageFileNotFoundException("Could not read file: " + key);
            }

            return resource;
        } catch (MalformedURLException e) {
            throw new StorageFileNotFoundException("Could not read file: " + key);
        }
    }

    @Override
    public void delete(String key) {
        var file = resolve(key);

        try {
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new StorageFileNotFoundException("Could not delete file: " + key);
        }
    }

    private @NonNull Path resolve(String filePath) {
        var resolved = root.resolve(filePath).normalize();

        if (!resolved.startsWith(root)) {
            throw new StorageException("Invalid file path");
        }

        return resolved;
    }
}
