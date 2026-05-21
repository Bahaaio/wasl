package com.github.bahaaio.wasl.storage.service;

import com.github.bahaaio.wasl.storage.exception.StorageFileNotFoundException;
import com.github.bahaaio.wasl.storage.model.StorageFile;

import org.springframework.core.io.Resource;

public interface StorageService {
    /**
     * Stores a file in the storage system using the specified key.
     *
     * @param mediaFile the file to store, represented as a {@link StorageFile}
     *                  containing the file's input stream, size, and MIME type
     * @param key       the unique storage key under which the file will be stored,
     *                  typically representing the file path or identifier
     */
    void store(StorageFile mediaFile, String key);

    /**
     * Loads a file as a {@link Resource}.
     *
     * @param key the unqiuq storage key of the file to load
     * @return the file as a readable {@link Resource}
     * @throws StorageFileNotFoundException if the file does not exist or is not readable
     */
    Resource load(String key);

    /**
     * Deletes the file at the specified path.
     *
     * @param key the relative path (storage key) of the file to delete
     * @throws StorageFileNotFoundException if the file cannot be deleted
     */
    void delete(String key);
}
