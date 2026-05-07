package com.github.bahaaio.wasl.media.service.processing;

import com.github.bahaaio.wasl.media.model.MediaType;
import com.github.bahaaio.wasl.media.model.ProcessedMedia;

import net.coobird.thumbnailator.Thumbnails;

import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Component
public class ImageProcessor implements MediaProcessor {
    @Override
    public boolean supports(@NonNull MediaType type) {
        return type.equals(MediaType.IMAGE);
    }

    @Override
    public ProcessedMedia process(MultipartFile file) throws IOException {
        var fullImageStream = generateFullSizeImage(file);
        var thumbnailImageStream = generateThumbnail(file);

        return new ProcessedMedia(fullImageStream, thumbnailImageStream);
    }

    private InputStream generateFullSizeImage(MultipartFile file) throws IOException {
        try (var inputStream = file.getInputStream()) {
            var outputStream = new ByteArrayOutputStream();

            Thumbnails.of(inputStream)
                .width(1920)
                .outputQuality(0.85)
                .outputFormat("jpg")
                .toOutputStream(outputStream);

            return new ByteArrayInputStream(outputStream.toByteArray());
        }
    }

    private InputStream generateThumbnail(MultipartFile file) throws IOException {
        try (var inputStream = file.getInputStream()) {
            var outputStream = new ByteArrayOutputStream();

            Thumbnails.of(inputStream)
                .width(640)
                .outputQuality(0.8)
                .outputFormat("jpg")
                .toOutputStream(outputStream);

            return new ByteArrayInputStream(outputStream.toByteArray());
        }
    }
}
