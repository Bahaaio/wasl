package com.github.bahaaio.wasl.media.service;

import com.github.bahaaio.wasl.auth.exception.ForbiddenException;
import com.github.bahaaio.wasl.media.dto.MediaDto;
import com.github.bahaaio.wasl.media.dto.MediaFileResponse;
import com.github.bahaaio.wasl.media.dto.MediaResponse;
import com.github.bahaaio.wasl.media.exception.MediaAlreadyAttachedException;
import com.github.bahaaio.wasl.media.model.Media;
import com.github.bahaaio.wasl.media.model.MediaOwnerType;
import com.github.bahaaio.wasl.media.model.MediaPathService;
import com.github.bahaaio.wasl.media.model.MediaState;
import com.github.bahaaio.wasl.media.repository.MediaRepository;
import com.github.bahaaio.wasl.media.service.processing.MediaProcessor;
import com.github.bahaaio.wasl.media.service.processing.MediaProcessorFactory;
import com.github.bahaaio.wasl.media.service.validation.MediaValidator;
import com.github.bahaaio.wasl.storage.exception.FileNotFoundException;
import com.github.bahaaio.wasl.storage.exception.StorageException;
import com.github.bahaaio.wasl.storage.service.StorageService;
import com.github.bahaaio.wasl.user.service.UserService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

// TODO: private media validation
@RequiredArgsConstructor
@Service
public class MediaService {
    private final MediaRepository mediaRepository;
    private final StorageService storageService;
    private final MediaPathService mediaPathService;
    private final UserService userService;
    private final MediaProcessorFactory mediaProcessorFactory;
    private final MediaValidator mediaValidator;

    @Transactional
    public MediaResponse uploadMedia(MultipartFile file, String uploaderUsername) {
        var validationResult = mediaValidator.validate(file);

        var uploader = userService.getEntityByUsername(uploaderUsername);
        var mimeType = validationResult.mimeType();
        var mediaType = validationResult.mediaType();

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

        MediaProcessor processor = mediaProcessorFactory.getProcessor(mediaType);

        try {
            var processed = processor.process(file);

            storageService.store(processed.fullStream(), fullPath);
            storageService.store(processed.thumbnailStream(), thumbnailPath);
        } catch (IOException e) {
            // TODO: fragile
            deleteMediaById(media.getId());
            throw new StorageException("Failed to save media");
        }

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

    public List<MediaDto> getByOwnerId(Long ownerId, MediaOwnerType ownerType) {
        var mediaList = mediaRepository.findAllByOwnerIdAndOwnerType(ownerId, ownerType);

        return mediaList.stream()
            .map(media -> new MediaDto(media.getId(), media.getType()))
            .toList();
    }

    @Transactional
    public MediaDto attachMedia(UUID mediaId, MediaOwnerType ownerType, Long ownerId, String username) {
        var media = mediaRepository.findById(mediaId)
            .orElseThrow(() -> new FileNotFoundException("Media not found"));

        if (!media.getUploader().getUsername().equals(username)) {
            throw new ForbiddenException();
        }

        if (media.getState() != MediaState.TEMP) {
            throw new MediaAlreadyAttachedException(mediaId);
        }

        media.setOwnerId(ownerId);
        media.setOwnerType(ownerType);
        media.setState(MediaState.ATTACHED);

        media = mediaRepository.save(media);

        return new MediaDto(media.getId(), media.getType());
    }

    @Transactional
    public void deleteMediaById(UUID id) {
        var media = mediaRepository.findById(id)
            .orElseThrow(() -> new FileNotFoundException("Media not found"));

        storageService.delete(mediaPathService.getFullPath(media));
        storageService.delete(mediaPathService.getThumbnailPath(media));
        storageService.delete(mediaPathService.getStorageKey(media.getId()));

        mediaRepository.deleteById(id);
    }

    @Transactional
    public void deleteMediaByOwnerId(Long ownerId, MediaOwnerType ownerType) {
        mediaRepository.findAllByOwnerIdAndOwnerType(ownerId, ownerType)
            .forEach(media -> deleteMediaById(media.getId()));
    }
}
