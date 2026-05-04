package com.github.bahaaio.wasl.post.controller;

import com.github.bahaaio.wasl.post.dto.PostCreateRequest;
import com.github.bahaaio.wasl.post.dto.PostDto;
import com.github.bahaaio.wasl.post.service.PostService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/posts")
public class PostsController {
    private final PostService postService;

    @GetMapping("/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable Long id) {
        var postDto = postService.getById(id);
        return ResponseEntity.ok(postDto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody PostCreateRequest request, Authentication authentication) {
        var postDto = postService.create(request, authentication.getName());
        return ResponseEntity.ok(postDto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePostById(@PathVariable Long id, Authentication authentication) {
        postService.deleteById(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
