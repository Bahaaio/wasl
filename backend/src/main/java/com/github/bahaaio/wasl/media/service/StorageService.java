package com.github.bahaaio.wasl.media.service;

import com.github.bahaaio.wasl.media.exception.FileNotFoundException;
import com.github.bahaaio.wasl.media.exception.StorageException;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    /**
     * Stores the given file at the specified path.
     *
     * @param file     the file to store; must not be empty
     * @param filePath the relative path (storage key) where the file will be stored
     * @throws StorageException if the file is empty or storing fails
     */
    void store(MultipartFile file, String filePath);

    /**
     * Loads a file as a {@link Resource}.
     *
     * @param filePath the relative path (storage key) of the file to load
     * @return the file as a readable {@link Resource}
     * @throws FileNotFoundException if the file does not exist or is not readable
     */
    Resource load(String filePath);

    /**
     * Deletes the file at the specified path.
     *
     * @param filePath the relative path (storage key) of the file to delete
     * @throws FileNotFoundException if the file cannot be deleted
     */
    void delete(String filePath);
}
