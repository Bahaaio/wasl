package com.github.bahaaio.wasl.user.controller;

import com.github.bahaaio.wasl.user.dto.UserDto;
import com.github.bahaaio.wasl.user.dto.UserPatchRequest;
import com.github.bahaaio.wasl.user.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users/me")
public class CurrentUserController {
    private final UserService userService;

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(userService.getUserByUsername(authentication.getName()));
    }

    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping
    public ResponseEntity<UserDto> updateCurrentUser(
        @Valid @RequestBody UserPatchRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.ok(userService.updateUserByUsername(authentication.getName(), request));
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping
    public ResponseEntity<Void> deleteCurrentUser(Authentication authentication) {
        userService.deleteUserByUsername(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
