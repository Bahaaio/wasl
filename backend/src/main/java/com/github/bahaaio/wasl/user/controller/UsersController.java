package com.github.bahaaio.wasl.user.controller;

import com.github.bahaaio.wasl.comment.dto.CommentDto;
import com.github.bahaaio.wasl.comment.service.CommentsService;
import com.github.bahaaio.wasl.post.dto.PostDto;
import com.github.bahaaio.wasl.post.service.PostService;
import com.github.bahaaio.wasl.user.dto.UserDto;
import com.github.bahaaio.wasl.user.service.UserService;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
public class UsersController {
    private final UserService userService;
    private final PostService postService;
    private final CommentsService commentsService;

    @GetMapping("/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @GetMapping("/{username}/comments")
    public ResponseEntity<PagedModel<CommentDto>> listUserComments(
        @PathVariable String username,
        @ParameterObject Pageable pageable,
        Authentication authentication
    ) {
        var currentUsername = authentication != null ? authentication.getName() : null;

        return ResponseEntity.ok(
            commentsService.listByUsername(username, pageable, currentUsername)
        );
    }

    @GetMapping("/{username}/posts")
    public ResponseEntity<PagedModel<PostDto>> listUserPosts(
        @PathVariable String username,
        @ParameterObject Pageable pageable,
        Authentication authentication
    ) {
        var currentUsername = authentication != null ? authentication.getName() : null;

        return ResponseEntity.ok(
            postService.listByUsername(username, pageable, currentUsername)
        );
    }
}
