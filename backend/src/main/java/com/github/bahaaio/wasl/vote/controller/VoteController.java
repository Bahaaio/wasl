package com.github.bahaaio.wasl.vote.controller;

import com.github.bahaaio.wasl.vote.dto.VoteRequest;
import com.github.bahaaio.wasl.vote.service.VoteService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1")
public class VoteController {
    private final VoteService voteService;

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/posts/{id}/vote")
    public ResponseEntity<Void> postVote(
        @PathVariable Long id,
        @Valid @RequestBody VoteRequest request,
        Authentication authentication
    ) {
        voteService.applyPostVote(id, request, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/comments/{id}/vote")
    public ResponseEntity<Void> commentVote(
        @PathVariable Long id,
        @Valid @RequestBody VoteRequest request,
        Authentication authentication
    ) {
        voteService.applyCommentVote(id, request, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
