package com.github.bahaaio.wasl.community.controller;

import com.github.bahaaio.wasl.community.service.CommunityMembershipService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/communities/{name}")
@RequiredArgsConstructor
public class CommunityMembershipController {
    private final CommunityMembershipService membershipService;

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/join")
    public ResponseEntity<Void> joinCommunity(
        @PathVariable String name,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        membershipService.joinCommunity(name, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/leave")
    public ResponseEntity<Void> leaveCommunity(
        @PathVariable String name,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        membershipService.leaveCommunity(name, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}