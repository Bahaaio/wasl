package com.github.bahaaio.wasl.media.service.processing;

import com.github.bahaaio.wasl.media.model.MediaType;
import com.github.bahaaio.wasl.media.model.ProcessedMedia;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface MediaProcessor {
    boolean supports(MediaType type);

    ProcessedMedia process(MultipartFile file) throws IOException;
}
