package com.github.bahaaio.wasl.media.service;

import com.github.bahaaio.wasl.media.dto.MediaFileResponse;
import com.github.bahaaio.wasl.media.dto.MediaResponse;
import com.github.bahaaio.wasl.media.exception.FileNotFoundException;
import com.github.bahaaio.wasl.media.exception.MediaAlreadyAttachedException;
import com.github.bahaaio.wasl.media.exception.UnsupportedMediaTypeException;
import com.github.bahaaio.wasl.media.model.*;
import com.github.bahaaio.wasl.media.repository.MediaRepository;
import com.github.bahaaio.wasl.user.service.UserService;

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
    private final UserService userService;

    @Transactional
    public MediaResponse uploadMedia(MultipartFile file, String uploaderUsername) {
        var uploader = userService.getEntityByUsername(uploaderUsername);

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
            .fullUrl("api/v1/media/" + media.getId())
            .thumbnailUrl("api/v1/media/" + media.getId() + "/thumbnail")
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

    public void attachMedia(UUID mediaId, MediaOwnerType ownerType, Long ownerId) {
        var media = mediaRepository.findById(mediaId)
            .orElseThrow(() -> new FileNotFoundException("Media not found"));

        if (media.getState() != MediaState.TEMP) {
            throw new MediaAlreadyAttachedException(mediaId);
        }

        media.setOwnerId(ownerId);
        media.setOwnerType(ownerType);
        media.setState(MediaState.ATTACHED);
    }

    // keeps directory empty
    public void deleteMediaById(UUID id) {
        var media = mediaRepository.findById(id)
            .orElseThrow(() -> new FileNotFoundException("Media not found"));

        storageService.delete(mediaPathService.getFullPath(media));
        storageService.delete(mediaPathService.getThumbnailPath(media));

        mediaRepository.deleteById(id);
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
