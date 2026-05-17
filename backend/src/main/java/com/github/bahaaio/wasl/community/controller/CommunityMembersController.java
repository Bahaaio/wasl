package com.github.bahaaio.wasl.community.controller;

import com.github.bahaaio.wasl.community.dto.response.CommunityMembershipDto;
import com.github.bahaaio.wasl.community.service.CommunityMembershipService;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/communities/{name}/members")
public class CommunityMembersController {
    private final CommunityMembershipService communityMembershipService;

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/members")
    public ResponseEntity<PagedModel<CommunityMembershipDto>> getCommunityMembers(
        @PathVariable String name,
        @ParameterObject Pageable pageable
    ) {
        return ResponseEntity.ok(communityMembershipService.getMembersByCommunityName(name, pageable));
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/members/{username}")
    public ResponseEntity<Void> removeMember(
        @PathVariable("name") String communityName,
        @PathVariable String username,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        communityMembershipService.removeMember(communityName, username, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
