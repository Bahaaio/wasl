package com.github.bahaaio.wasl.community.controller;

import com.github.bahaaio.wasl.community.dto.request.CommunityCreateRequest;
import com.github.bahaaio.wasl.community.dto.request.CommunityPatchRequest;
import com.github.bahaaio.wasl.community.dto.response.CommunityDto;
import com.github.bahaaio.wasl.community.service.CommunityMembershipService;
import com.github.bahaaio.wasl.community.service.CommunityService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/communities")
public class CommunityController {
    private final CommunityService communityService;
    private final CommunityMembershipService membershipService;

    @GetMapping
    public ResponseEntity<List<CommunityDto>> getAllCommunities() {
        return ResponseEntity.ok(communityService.getAllCommunities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityDto> getCommunityById(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.getById(id));
    }

    @PostMapping
    public ResponseEntity<CommunityDto> createCommunity(
        @Valid @RequestBody CommunityCreateRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(communityService.createCommunity(request, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommunityDto> updateCommunity(
        @PathVariable Long id,
        @Valid @RequestBody CommunityPatchRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(communityService.updateCommunity(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommunity(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        communityService.deleteCommunity(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Void> joinCommunity(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        membershipService.joinCommunity(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/leave")
    public ResponseEntity<Void> leaveCommunity(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        membershipService.leaveCommunity(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}