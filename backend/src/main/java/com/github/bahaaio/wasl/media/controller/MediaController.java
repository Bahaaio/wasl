package com.github.bahaaio.wasl.media.controller;

import com.github.bahaaio.wasl.media.dto.MediaResponse;
import com.github.bahaaio.wasl.media.service.MediaService;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

// TODO: ownership checks
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/media")
public class MediaController {
    private final MediaService mediaService;

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getMedia(@PathVariable UUID id) {
        var response = mediaService.getFullMedia(id);

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(response.mimeType()))
            .body(response.file());
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<Resource> getMediaThumbnail(@PathVariable UUID id) {
        var response = mediaService.getMediaThumbnail(id);

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(response.mimeType()))
            .body(response.file());
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<MediaResponse> uploadMedia(@RequestParam("file") MultipartFile file,
                                                     Authentication authentication) {
        var uploaderUsername = authentication.getName();
        var dto = mediaService.uploadMedia(file, uploaderUsername);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
}
