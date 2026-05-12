package com.github.bahaaio.wasl.media.service.validation;

import com.github.bahaaio.wasl.media.config.MediaProperties;
import com.github.bahaaio.wasl.media.exception.MediaTooLargeException;
import com.github.bahaaio.wasl.media.exception.UnsupportedMediaTypeException;
import com.github.bahaaio.wasl.media.model.MediaType;
import com.github.bahaaio.wasl.media.model.ValidationResult;
import com.github.bahaaio.wasl.storage.exception.StorageException;

import org.apache.tika.Tika;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class MediaValidator {
    private final MediaProperties mediaProperties;
    private final Tika tika = new Tika();

    public ValidationResult validate(MultipartFile file) {
        if (file.isEmpty()) throw new StorageException("File is empty");

        var mime = detectMimeType(file);
        if (!mediaProperties.getAllowedTypes().contains(mime)) {
            throw new UnsupportedMediaTypeException(mime);
        }

        var mediaType = resolveMediaType(mime);

        validateMediaSize(file, mediaType);

        return new ValidationResult(mime, mediaType);
    }

    private String detectMimeType(MultipartFile file) {
        try (var inputStream = file.getInputStream()) {
            return tika.detect(inputStream);
        } catch (IOException e) {
            throw new UnsupportedMediaTypeException("Failed to detect media type");
        }
    }

    private MediaType resolveMediaType(String mime) {
        if (mime.equals("image/gif")) return MediaType.GIF;
        if (mime.startsWith("image/")) return MediaType.IMAGE;
        if (mime.startsWith("video/")) return MediaType.VIDEO;

        throw new UnsupportedMediaTypeException(mime);
    }

    private void validateMediaSize(MultipartFile file, MediaType mediaType) {
        long maxAllowedSize = switch (mediaType) {
            case GIF -> mediaProperties.getMaxGifSize().toBytes();
            case IMAGE -> mediaProperties.getMaxImageSize().toBytes();
            case VIDEO -> mediaProperties.getMaxVideoSize().toBytes();
        };

        if (file.getSize() > maxAllowedSize) {
            throw new MediaTooLargeException(maxAllowedSize, file.getSize(), mediaType);
        }
    }
}
