package com.github.bahaaio.wasl.community.controller;

import com.github.bahaaio.wasl.community.dto.request.CommunityCreateRequest;
import com.github.bahaaio.wasl.community.dto.request.CommunityPatchRequest;
import com.github.bahaaio.wasl.community.dto.response.CommunityDto;
import com.github.bahaaio.wasl.community.service.CommunityService;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/communities")
public class CommunityController {
    private final CommunityService communityService;

    @GetMapping
    public ResponseEntity<PagedModel<CommunityDto>> getAllCommunities(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(communityService.getAllCommunities(pageable));
    }

    @GetMapping("/{name}")
    public ResponseEntity<CommunityDto> getCommunityByName(@PathVariable String name) {
        return ResponseEntity.ok(communityService.getByName(name));
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<CommunityDto> createCommunity(
        @Valid @RequestBody CommunityCreateRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            communityService.createCommunity(request, userDetails.getUsername())
        );
    }

    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{name}")
    public ResponseEntity<CommunityDto> updateCommunity(
        @PathVariable String name,
        @Valid @RequestBody CommunityPatchRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(communityService.updateCommunity(name, request, userDetails.getUsername()));
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{name}")
    public ResponseEntity<Void> deleteCommunity(
        @PathVariable String name,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        communityService.deleteCommunity(name, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}