package com.github.bahaaio.wasl.community.controller;

import com.github.bahaaio.wasl.community.dto.response.CommunityMediaUpdateResponse;
import com.github.bahaaio.wasl.community.service.CommunityMediaService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/communities/{name}")
public class CommunityMediaController {
    private final CommunityMediaService communityMediaService;

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/icon")
    public ResponseEntity<CommunityMediaUpdateResponse> updateCommunityIcon(
        @PathVariable String name,
        @RequestParam("file") MultipartFile file,
        Authentication authentication
    ) {
        var dto = communityMediaService.updateIcon(name, file, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/icon")
    public ResponseEntity<Void> deleteCommunityIcon(
        @PathVariable String name,
        Authentication authentication
    ) {
        communityMediaService.deleteIcon(name, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/banner")
    public ResponseEntity<CommunityMediaUpdateResponse> updateCommunityBanner(
        @PathVariable String name,
        @RequestParam("file") MultipartFile file,
        Authentication authentication
    ) {
        var dto = communityMediaService.updateBanner(name, file, authentication.getName());
        return ResponseEntity.ok(dto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/banner")
    public ResponseEntity<Void> deleteCommunityBanner(
        @PathVariable String name,
        Authentication authentication
    ) {
        communityMediaService.deleteBanner(name, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
