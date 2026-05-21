package com.github.bahaaio.wasl.storage.model;

import java.io.InputStream;

/**
 * Represents a file to be stored, encapsulating the content as an input stream along with its size and MIME type.
 *
 * @param inputStream the input stream providing access to the file content
 * @param size        the size of the file in bytes
 * @param mimeType    the MIME type of the file, describing its format
 */
public record StorageFile(
    InputStream inputStream,
    long size,
    String mimeType
) {
}
