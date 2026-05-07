package com.github.bahaaio.wasl.media.service.processing;

import com.github.bahaaio.wasl.media.exception.UnsupportedMediaTypeException;
import com.github.bahaaio.wasl.media.model.MediaType;

import org.springframework.stereotype.Component;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class MediaProcessorFactory {
    private final List<MediaProcessor> processors;

    public MediaProcessor getProcessor(MediaType mediaType) {
        return processors.stream()
            .filter(p -> p.supports(mediaType))
            .findFirst()
            .orElseThrow(() -> new UnsupportedMediaTypeException("Unsupported media type"));
    }
}
