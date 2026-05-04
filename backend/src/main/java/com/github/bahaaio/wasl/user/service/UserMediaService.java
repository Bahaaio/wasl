package com.github.bahaaio.wasl.user.service;

import com.github.bahaaio.wasl.media.model.MediaOwnerType;
import com.github.bahaaio.wasl.media.service.MediaService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserMediaService {
    private final MediaService mediaService;
    private final UserService userService;

    @Transactional
    public void updateAvatar(MultipartFile file, String username) {
        var user = userService.getEntityByUsername(username);
        var response = mediaService.uploadMedia(file, username);

        mediaService.attachMedia(response.id(), MediaOwnerType.USER, user.getId());
        user.setAvatarMediaId(response.id());
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
    public void updateBanner(MultipartFile file, String username) {
        var user = userService.getEntityByUsername(username);
        var response = mediaService.uploadMedia(file, username);

        mediaService.attachMedia(response.id(), MediaOwnerType.USER, user.getId());
        user.setBannerMediaId(response.id());
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
