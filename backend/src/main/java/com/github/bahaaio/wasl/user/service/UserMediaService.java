package com.github.bahaaio.wasl.user.service;

import com.github.bahaaio.wasl.media.model.MediaOwnerType;
import com.github.bahaaio.wasl.media.service.MediaService;
import com.github.bahaaio.wasl.user.dto.UserMediaUpdateResponse;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserMediaService {
    private final MediaService mediaService;
    private final UserService userService;

    @Transactional
    public UserMediaUpdateResponse updateAvatar(MultipartFile file, String username) {
        var user = userService.getEntityByUsername(username);
        UUID oldAvatarMediaId = user.getAvatarMediaId();

        var response = mediaService.uploadMedia(file, username);
        var mediaDto = mediaService.attachMedia(response.id(), MediaOwnerType.USER, user.getId(), username);
        user.setAvatarMediaId(response.id());

        if (oldAvatarMediaId != null) {
            mediaService.deleteMediaById(oldAvatarMediaId);
        }

        return new UserMediaUpdateResponse(mediaDto.id());
    }

    @Transactional
    public void deleteAvatar(String username) {
        var user = userService.getEntityByUsername(username);

        if (user.getAvatarMediaId() != null) {
            mediaService.deleteMediaById(user.getAvatarMediaId());
            user.setAvatarMediaId(null);
        }
    }

    @Transactional
    public UserMediaUpdateResponse updateBanner(MultipartFile file, String username) {
        var user = userService.getEntityByUsername(username);
        UUID oldBannerMediaId = user.getBannerMediaId();

        var response = mediaService.uploadMedia(file, username);
        var mediaDto = mediaService.attachMedia(response.id(), MediaOwnerType.USER, user.getId(), username);
        user.setBannerMediaId(response.id());

        if (oldBannerMediaId != null) {
            mediaService.deleteMediaById(oldBannerMediaId);
        }

        return new UserMediaUpdateResponse(mediaDto.id());
    }

    @Transactional
    public void deleteBanner(String username) {
        var user = userService.getEntityByUsername(username);

        if (user.getBannerMediaId() != null) {
            mediaService.deleteMediaById(user.getBannerMediaId());
            user.setBannerMediaId(null);
        }
    }
}
