package com.github.bahaaio.wasl.media.service.processing;

import com.github.bahaaio.wasl.media.model.MediaType;
import com.github.bahaaio.wasl.media.model.ProcessedMedia;
import com.github.bahaaio.wasl.storage.model.StorageFile;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class RawFileProcessor implements MediaProcessor {
    @Override
    public boolean supports(MediaType type) {
        return true;
    }

    @Override
    public ProcessedMedia process(MultipartFile file) throws IOException {
        var full = new StorageFile(file.getInputStream(), file.getSize(), file.getContentType());
        var thumbnail = new StorageFile(file.getInputStream(), file.getSize(), file.getContentType());

        // noop
        return new ProcessedMedia(full, thumbnail);
    }
}
