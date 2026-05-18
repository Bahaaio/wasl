package com.github.bahaaio.wasl.user.controller;

import com.github.bahaaio.wasl.community.dto.response.CommunityDto;
import com.github.bahaaio.wasl.community.service.CommunityService;
import com.github.bahaaio.wasl.post.dto.PostDto;
import com.github.bahaaio.wasl.vote.service.VoteService;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users/me")
public class CurrentUserActivityController {
    private final VoteService voteService;
    private final CommunityService communityService;

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/communities")
    public ResponseEntity<PagedModel<CommunityDto>> listSubbedCommunities(
        @ParameterObject Pageable pageable,
        Authentication authentication
    ) {
        return ResponseEntity.ok(
            communityService.listUserSubbed(authentication.getName(), pageable)
        );
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/upvoted")
    public ResponseEntity<PagedModel<PostDto>> listUpvotedPosts(
        @ParameterObject Pageable pageable,
        Authentication authentication
    ) {
        return ResponseEntity.ok(
            voteService.listVotedPostsByUsername(authentication.getName(), true, pageable)
        );
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/downvoted")
    public ResponseEntity<PagedModel<PostDto>> listDownvotedPosts(
        @ParameterObject Pageable pageable,
        Authentication authentication
    ) {
        return ResponseEntity.ok(
            voteService.listVotedPostsByUsername(authentication.getName(), false, pageable)
        );
    }
}
