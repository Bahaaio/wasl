package com.github.bahaaio.wasl.user.controller;

import com.github.bahaaio.wasl.post.dto.PostDto;
import com.github.bahaaio.wasl.post.service.PostService;
import com.github.bahaaio.wasl.user.dto.UserDto;
import com.github.bahaaio.wasl.user.service.UserService;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        var dto = userService.getUserByUsername(username);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{username}/posts")
    public ResponseEntity<PagedModel<PostDto>> listUserPosts(@PathVariable String username, @ParameterObject Pageable pageable) {
        var postsDto = postService.listByUsername(username, pageable);
        return ResponseEntity.ok(postsDto);
    }
}
