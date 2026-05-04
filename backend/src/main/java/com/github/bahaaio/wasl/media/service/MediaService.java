package com.github.bahaaio.wasl.media.service;

import com.github.bahaaio.wasl.media.dto.MediaFileResponse;
import com.github.bahaaio.wasl.media.dto.MediaResponse;
import com.github.bahaaio.wasl.media.exception.FileNotFoundException;
import com.github.bahaaio.wasl.media.exception.UnsupportedMediaTypeException;
import com.github.bahaaio.wasl.media.model.Media;
import com.github.bahaaio.wasl.media.model.MediaPathService;
import com.github.bahaaio.wasl.media.model.MediaState;
import com.github.bahaaio.wasl.media.model.MediaType;
import com.github.bahaaio.wasl.media.repository.MediaRepository;
import com.github.bahaaio.wasl.user.exception.UsernameNotFoundException;
import com.github.bahaaio.wasl.user.repository.UserRepository;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

// TODO: validation
// TODO: compression & resizing
@RequiredArgsConstructor
@Service
public class MediaService {
    private final MediaRepository mediaRepository;
    private final StorageService storageService;
    private final MediaPathService mediaPathService;
    private final Tika tika;
    private final UserRepository userRepository;

    @Transactional
    public MediaResponse uploadMedia(MultipartFile file, String uploaderUsername) {
        var uploader = userRepository.findByUsername(uploaderUsername)
            .orElseThrow(() -> new UsernameNotFoundException(uploaderUsername));

        var mimeType = getMimeType(file);
        var mediaType = resolveMimeType(mimeType);

        var media = mediaRepository.save(
            Media.builder()
                .type(mediaType)
                .mimeType(mimeType)
                .uploader(uploader)
                .state(MediaState.TEMP)
                .build()
        );

        var fullPath = mediaPathService.getFullPath(media);
        var thumbnailPath = mediaPathService.getThumbnailPath(media);

        storageService.store(file, fullPath);
        // TODO: generate thumbnail
        storageService.store(file, thumbnailPath);

        return MediaResponse.builder()
            .id(media.getId())
            .type(mediaType)
            .fullUrl("/media/" + media.getId() + "/full")
            .previewUrl("/media/" + media.getId() + "/preview")
            .build();
    }

    public MediaFileResponse getFullMedia(UUID id) {
        var media = mediaRepository.findById(id)
            .orElseThrow(() -> new FileNotFoundException("Media not found"));

        var path = mediaPathService.getFullPath(media);
        var file = storageService.load(path);

        return new MediaFileResponse(file, media.getMimeType());
    }

    public MediaFileResponse getMediaThumbnail(UUID id) {
        var media = mediaRepository.findById(id)
            .orElseThrow(() -> new FileNotFoundException("Media not found"));

        var path = mediaPathService.getThumbnailPath(media);
        var file = storageService.load(path);

        return new MediaFileResponse(file, media.getMimeType());
    }

    private String getMimeType(MultipartFile file) {
        try (var inputStream = file.getInputStream()) {
            return tika.detect(inputStream);
        } catch (IOException e) {
            throw new UnsupportedMediaTypeException("Failed to detect media type");
        }
    }

    private MediaType resolveMimeType(String mime) {
        if (mime.startsWith("image/")) {
            return MediaType.IMAGE;
        }

        if (mime.startsWith("video/")) {
            return MediaType.VIDEO;
        }

        throw new UnsupportedMediaTypeException(mime);
    }
}
