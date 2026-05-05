package com.github.bahaaio.wasl.community.controller;

import com.github.bahaaio.wasl.community.dto.response.CommunityMembershipDto;
import com.github.bahaaio.wasl.community.service.CommunityMembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/community-memberships")
@RequiredArgsConstructor
public class CommunityMembershipController {

    private final CommunityMembershipService membershipService;

    @GetMapping("/community/{communityId}")
    public ResponseEntity<List<CommunityMembershipDto>> getCommunityMembers(
            @PathVariable Long communityId
    ) {
        return ResponseEntity.ok(membershipService.getMembersByCommunityId(communityId));
    }

    @DeleteMapping("/community/{communityId}/member/{membershipId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long communityId,
            @PathVariable Long membershipId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        membershipService.removeMember(communityId, membershipId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}