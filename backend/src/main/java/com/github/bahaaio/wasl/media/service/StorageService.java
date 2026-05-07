package com.github.bahaaio.wasl.media.service;

import com.github.bahaaio.wasl.media.exception.FileNotFoundException;
import com.github.bahaaio.wasl.media.exception.StorageException;

import org.springframework.core.io.Resource;

import java.io.InputStream;

public interface StorageService {
    /**
     * Stores the given file at the specified path.
     *
     * @param inputStream the file to store; must not be empty
     * @param destination the unique storage key where the file will be stored
     * @throws StorageException if the file is empty or storing fails
     */
    void store(InputStream inputStream, String destination);

    /**
     * Loads a file as a {@link Resource}.
     *
     * @param key the unqiuq storage key of the file to load
     * @return the file as a readable {@link Resource}
     * @throws FileNotFoundException if the file does not exist or is not readable
     */
    Resource load(String key);

    /**
     * Deletes the file at the specified path.
     *
     * @param filePath the relative path (storage key) of the file to delete
     * @throws FileNotFoundException if the file cannot be deleted
     */
    void delete(String filePath);
}
