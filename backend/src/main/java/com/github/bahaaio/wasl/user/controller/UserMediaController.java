package com.github.bahaaio.wasl.user.controller;

import com.github.bahaaio.wasl.user.dto.UserMediaUpdateResponse;
import com.github.bahaaio.wasl.user.service.UserMediaService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users/me")
public class UserMediaController {
    private final UserMediaService userMediaService;

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/avatar")
    public ResponseEntity<UserMediaUpdateResponse> updateCurrentUserAvatar(@RequestParam("file") MultipartFile file,
                                                                           Authentication authentication) {
        var dto = userMediaService.updateAvatar(file, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/avatar")
    public ResponseEntity<Void> deleteUserAvatar(Authentication authentication) {
        userMediaService.deleteAvatar(authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/banner")
    public ResponseEntity<UserMediaUpdateResponse> updateCurrentUserBanner(@RequestParam("file") MultipartFile file,
                                                                           Authentication authentication) {
        var dto = userMediaService.updateBanner(file, authentication.getName());
        return ResponseEntity.ok(dto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/banner")
    public ResponseEntity<Void> deleteCurrentUserBanner(Authentication authentication) {
        userMediaService.deleteBanner(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
