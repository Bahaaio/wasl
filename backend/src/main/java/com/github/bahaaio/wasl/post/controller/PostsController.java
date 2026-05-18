package com.github.bahaaio.wasl.post.controller;

import com.github.bahaaio.wasl.post.dto.PostCreateRequest;
import com.github.bahaaio.wasl.post.dto.PostDto;
import com.github.bahaaio.wasl.post.dto.PostPatchRequest;
import com.github.bahaaio.wasl.post.service.PostService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/posts")
public class PostsController {
    private final PostService postService;

    @GetMapping("/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable Long id, Authentication authentication) {
        var username = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(postService.getById(id, username));
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<PostDto> createPost(
        @Valid @RequestBody PostCreateRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            postService.create(request, authentication.getName())
        );
    }

    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}")
    public ResponseEntity<PostDto> patchPost(
        @PathVariable Long id,
        @Valid @RequestBody PostPatchRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.ok(
            postService.patchById(id, request, authentication.getName())
        );
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePostById(@PathVariable Long id, Authentication authentication) {
        postService.deleteById(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
