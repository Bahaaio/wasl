package com.github.bahaaio.wasl.comment.controller;

import com.github.bahaaio.wasl.comment.dto.CommentDto;
import com.github.bahaaio.wasl.comment.dto.CommentPatchRequest;
import com.github.bahaaio.wasl.comment.service.CommentsService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/comments")
public class CommentsController {
    private final CommentsService commentsService;

    @GetMapping("/{id}")
    public ResponseEntity<CommentDto> getCommentById(@PathVariable Long id, Authentication authentication) {
        var username = authentication != null ? authentication.getName() : null;
        var commentDto = commentsService.getById(id, username);

        return ResponseEntity.ok(commentDto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}")
    public ResponseEntity<CommentDto> patchCommentById(
        @PathVariable Long id,
        @Valid @RequestBody CommentPatchRequest request,
        Authentication authentication
    ) {
        var commentDto = commentsService.patchById(id, request, authentication.getName());
        return ResponseEntity.ok(commentDto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommentById(@PathVariable Long id, Authentication authentication) {
        commentsService.deleteById(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
