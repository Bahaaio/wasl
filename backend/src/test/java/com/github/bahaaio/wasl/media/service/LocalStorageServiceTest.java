package com.github.bahaaio.wasl.media.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

import com.github.bahaaio.wasl.storage.config.StorageProperties;
import com.github.bahaaio.wasl.storage.exception.StorageFileNotFoundException;
import com.github.bahaaio.wasl.storage.model.StorageFile;
import com.github.bahaaio.wasl.storage.service.LocalStorageService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.UUID;

class LocalStorageServiceTest {
    LocalStorageService storageService;

    @BeforeEach
    void setUp() {
        var props = new StorageProperties();
        props.getLocal().setLocation("/tmp");
        storageService = new LocalStorageService(props);
    }

    @Test
    void testStoreAndLoad() throws IOException {
        var content = "Hello world".getBytes();
        var file = new MockMultipartFile("file.txt", content);
        var fileName = UUID.randomUUID() + ".txt";
        var path = "test/" + fileName;

        storageService.store(
            new StorageFile(file.getInputStream(), content.length, "text/plain"),
            path
        );
        var resource = storageService.load(path);

        assertThat(resource.exists()).isTrue();
        assertThat(resource.getFilename()).isEqualTo(fileName);
        assertThat(content).isEqualTo(resource.getContentAsByteArray());
    }

    @Test
    void testStoreAndDelete() throws IOException {
        var content = "Hello world".getBytes();
        var file = new MockMultipartFile("file.txt", content);
        var path = "test/" + UUID.randomUUID() + ".txt";

        storageService.store(
            new StorageFile(file.getInputStream(), content.length, "text/plain"),
            path
        );
        storageService.delete(path);

        assertThatThrownBy(() -> storageService.load(path))
            .isInstanceOf(StorageFileNotFoundException.class);
    }
}