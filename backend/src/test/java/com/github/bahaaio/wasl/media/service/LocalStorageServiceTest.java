package com.github.bahaaio.wasl.media.service;

import static org.junit.jupiter.api.Assertions.*;

import com.github.bahaaio.wasl.media.config.StorageProperties;
import com.github.bahaaio.wasl.media.exception.FileNotFoundException;
import com.github.bahaaio.wasl.media.exception.StorageException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.UUID;

@SpringBootTest
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
        var path = "test/" + UUID.randomUUID() + ".txt";

        storageService.store(file, path);
        var resource = storageService.load(path);

        assertTrue(resource.exists());
        assertArrayEquals(content, resource.getContentAsByteArray());
    }

    @Test
    void testStoreAndDelete() {
        var content = "Hello world".getBytes();
        var file = new MockMultipartFile("file.txt", content);
        var path = "test/" + UUID.randomUUID() + ".txt";

        storageService.store(file, path);
        storageService.delete(path);

        assertThrows(FileNotFoundException.class,
            () -> storageService.load(path));
    }

    @Test
    void store_shouldThrow_whenGivenEmptyFile() {
        var file = new MockMultipartFile("file.txt", new byte[0]);
        var path = "test/" + UUID.randomUUID() + ".txt";

        assertThrows(StorageException.class,
            () -> storageService.store(file, path));
    }
}