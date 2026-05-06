package com.github.bahaaio.wasl.user.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.github.bahaaio.wasl.media.dto.MediaResponse;
import com.github.bahaaio.wasl.media.model.MediaOwnerType;
import com.github.bahaaio.wasl.media.service.MediaService;
import com.github.bahaaio.wasl.user.model.User;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.UUID;

@ExtendWith(MockitoExtension.class)
class UserMediaServiceTest {
    @Mock
    MediaService mediaService;

    @Mock
    UserService userService;

    @InjectMocks
    UserMediaService userMediaService;

    @Test
    void testUpdateAvatar() {
        var avatar = new MockMultipartFile("profile.png", "image".getBytes());
        var oldAvatarMediaId = UUID.randomUUID();
        var user = User.builder().id(1L).username("bahaa").avatarMediaId(oldAvatarMediaId).build();
        var response = MediaResponse.builder().id(UUID.randomUUID()).build();

        given(userService.getEntityByUsername("bahaa")).willReturn(user);
        given(mediaService.uploadMedia(any(), any())).willReturn(response);
        given(mediaService.attachMedia(any(), any(), any(), any())).willReturn(null);

        userMediaService.updateAvatar(avatar, "bahaa");

        assertThat(user.getAvatarMediaId()).isEqualTo(response.id());

        then(mediaService).should().uploadMedia(avatar, "bahaa");
        then(mediaService).should().attachMedia(response.id(), MediaOwnerType.USER, user.getId(), user.getUsername());
        then(mediaService).should().deleteMediaById(oldAvatarMediaId);
    }

    @Test
    void testDeleteAvatar() {
        var oldAvatarMediaId = UUID.randomUUID();
        var user = User.builder().id(1L).username("bahaa").avatarMediaId(oldAvatarMediaId).build();

        given(userService.getEntityByUsername("bahaa")).willReturn(user);

        userMediaService.deleteAvatar("bahaa");

        assertThat(user.getAvatarMediaId()).isNull();

        then(mediaService).should().deleteMediaById(oldAvatarMediaId);
    }

    @Test
    void testUpdateBanner() {
        var banner = new MockMultipartFile("profile.png", "image".getBytes());
        var oldBannerMediaId = UUID.randomUUID();
        var user = User.builder().id(1L).username("bahaa").bannerMediaId(oldBannerMediaId).build();
        var response = MediaResponse.builder().id(UUID.randomUUID()).build();

        given(userService.getEntityByUsername("bahaa")).willReturn(user);
        given(mediaService.uploadMedia(any(), any())).willReturn(response);
        given(mediaService.attachMedia(any(), any(), any(), any())).willReturn(null);

        userMediaService.updateBanner(banner, "bahaa");

        assertThat(user.getBannerMediaId()).isEqualTo(response.id());

        then(mediaService).should().uploadMedia(banner, "bahaa");
        then(mediaService).should().attachMedia(response.id(), MediaOwnerType.USER, user.getId(), user.getUsername());
        then(mediaService).should().deleteMediaById(oldBannerMediaId);
    }

    @Test
    void testDeleteBanner() {
        var oldBannerMediaId = UUID.randomUUID();
        var user = User.builder().id(1L).username("bahaa").bannerMediaId(oldBannerMediaId).build();

        given(userService.getEntityByUsername("bahaa")).willReturn(user);

        userMediaService.deleteBanner("bahaa");

        assertThat(user.getBannerMediaId()).isNull();

        then(mediaService).should().deleteMediaById(oldBannerMediaId);
    }
}