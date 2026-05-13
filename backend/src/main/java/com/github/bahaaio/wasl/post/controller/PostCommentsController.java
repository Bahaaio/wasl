package com.github.bahaaio.wasl.post.controller;

import com.github.bahaaio.wasl.comment.dto.CommentCreateRequest;
import com.github.bahaaio.wasl.comment.dto.CommentDto;
import com.github.bahaaio.wasl.comment.dto.CommentFeedResponse;
import com.github.bahaaio.wasl.comment.service.CommentsService;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/posts/{postId}/comments")
public class PostCommentsController {
    private final CommentsService commentsService;

    @GetMapping
    public ResponseEntity<CommentFeedResponse> listPostComments(
        @PathVariable Long postId,
        @ParameterObject Pageable pageable,
        Authentication authentication
    ) {
        var username = authentication != null ? authentication.getName() : null;
        var commentDtoPagedModel = commentsService.listByPostId(postId, pageable, username);

        return ResponseEntity.ok(commentDtoPagedModel);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<CommentDto> reply(
        @PathVariable Long postId,
        @Valid @RequestBody CommentCreateRequest request,
        Authentication authentication
    ) {
        var commentDto = commentsService.reply(postId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(commentDto);
    }
}
