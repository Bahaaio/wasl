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

    @GetMapping("/{commentId}")
    public ResponseEntity<CommentDto> getCommentById(@PathVariable Long commentId, Authentication authentication) {
        var commentDto = commentsService.getById(commentId, authentication.getName());
        return ResponseEntity.ok(commentDto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{commentId}")
    public ResponseEntity<CommentDto> patchCommentById(
        @PathVariable Long commentId,
        @Valid @RequestBody CommentPatchRequest request,
        Authentication authentication
    ) {
        var commentDto = commentsService.patchById(commentId, request, authentication.getName());
        return ResponseEntity.ok(commentDto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteCommentById(@PathVariable Long commentId, Authentication authentication) {
        commentsService.deleteById(commentId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
