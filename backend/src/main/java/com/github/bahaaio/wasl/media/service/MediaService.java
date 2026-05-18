package com.github.bahaaio.wasl.media.service;

import com.github.bahaaio.wasl.auth.exception.ForbiddenException;
import com.github.bahaaio.wasl.media.config.MediaCleanupProperties;
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
import java.time.Instant;
import java.util.List;
import java.util.Set;
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
    private final MediaCleanupProperties mediaCleanupProperties;

    public List<MediaDto> getByOwnerId(Long ownerId, MediaOwnerType ownerType) {
        var mediaList = mediaRepository.findAllByOwnerIdAndOwnerTypeOrderByPosition(ownerId, ownerType);

        return mediaList.stream()
            .map(media -> new MediaDto(media.getId(), media.getType()))
            .toList();
    }

    private Media getEntityById(UUID id) {
        return mediaRepository.findById(id)
            .orElseThrow(() -> new FileNotFoundException("Media not found"));
    }

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
            deleteMedia(media);
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
        var media = getEntityById(id);

        var path = mediaPathService.getFullPath(media);
        var file = storageService.load(path);

        return new MediaFileResponse(file, media.getMimeType());
    }

    public MediaFileResponse getMediaThumbnail(UUID id) {
        var media = getEntityById(id);

        var path = mediaPathService.getThumbnailPath(media);
        var file = storageService.load(path);

        return new MediaFileResponse(file, media.getMimeType());
    }

    @Transactional
    public MediaDto attachMedia(UUID mediaId, MediaOwnerType ownerType, Long ownerId, String username) {
        return attachMedia(mediaId, ownerType, ownerId, username, null);
    }

    @Transactional
    public MediaDto attachMedia(UUID mediaId, MediaOwnerType ownerType, Long ownerId, String username, Integer position) {
        var media = getEntityById(mediaId);

        if (!media.getUploader().getUsername().equals(username)) {
            throw new ForbiddenException();
        }

        if (media.getState() != MediaState.TEMP) {
            throw new MediaAlreadyAttachedException(mediaId);
        }

        media.setOwnerId(ownerId);
        media.setOwnerType(ownerType);
        media.setPosition(position);
        media.setState(MediaState.ATTACHED);

        media = mediaRepository.save(media);

        return new MediaDto(media.getId(), media.getType());
    }

    @Transactional
    public MediaDto updatePosition(UUID id, int position) {
        var media = getEntityById(id);
        media.setPosition(position);
        mediaRepository.save(media);

        return new MediaDto(media.getId(), media.getType());
    }

    public void deleteMediaById(UUID id) {
        var media = getEntityById(id);
        deleteMedia(media);
    }

    public void deleteMedia(Media media) {
        mediaRepository.delete(media);
        deleteMediaFiles(media);
    }

    public void deleteAllMediaById(Set<UUID> mediaIds) {
        var mediaList = mediaRepository.findAllById(mediaIds);
        deleteAllMedia(mediaList);
    }

    public void deleteAllMedia(List<Media> mediaList) {
        mediaRepository.deleteAllInBatch(mediaList);
        mediaList.forEach(this::deleteMediaFiles);
    }

    @Transactional
    public void deleteMediaByOwnerId(Long ownerId, MediaOwnerType ownerType) {
        var mediaList = mediaRepository.findAllByOwnerIdAndOwnerType(ownerId, ownerType);
        deleteAllMedia(mediaList);
    }

    /**
     * Deletes orphaned media files that are in a temporary state and have been created
     * before a specified cutoff time.
     * <p>
     * The retention period used to calculate the cutoff
     * time is obtained from the media cleanup properties.
     */
    @Transactional
    public void deleteOrphanedMedia() {
        var cutoffTime = Instant.now().minus(mediaCleanupProperties.getRetention());
        var orphanedMedia = mediaRepository.findAllByStateAndCreatedAtBefore(MediaState.TEMP, cutoffTime);

        deleteAllMedia(orphanedMedia);
    }

    private void deleteMediaFiles(Media media) {
        try {
            storageService.delete(mediaPathService.getFullPath(media));
            storageService.delete(mediaPathService.getThumbnailPath(media));
            storageService.delete(mediaPathService.getStorageKey(media.getId()));
        } catch (FileNotFoundException ignored) {
        }
    }
}
