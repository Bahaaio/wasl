package com.github.bahaaio.wasl.media.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

import com.github.bahaaio.wasl.media.config.StorageProperties;
import com.github.bahaaio.wasl.media.exception.FileNotFoundException;

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
        props.setLocation("/tmp");
        storageService = new LocalStorageService(props);
    }

    @Test
    void testStoreAndLoad() throws IOException {
        var content = "Hello world".getBytes();
        var file = new MockMultipartFile("file.txt", content);
        var fileName = UUID.randomUUID() + ".txt";
        var path = "test/" + fileName;

        storageService.store(file.getInputStream(), path);
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

        storageService.store(file.getInputStream(), path);
        storageService.delete(path);

        assertThatThrownBy(() -> storageService.load(path))
            .isInstanceOf(FileNotFoundException.class);
    }
}