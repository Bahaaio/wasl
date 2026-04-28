package com.github.bahaaio.wasl.user.controller;

import com.github.bahaaio.wasl.user.dto.UserDto;
import com.github.bahaaio.wasl.user.dto.UserUpdateRequest;
import com.github.bahaaio.wasl.user.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@RestController
public class UserController {
    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        var dto = userService.getUserByUsername(username);
        return ResponseEntity.ok(dto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        var dto = userService.getUserByUsername(authentication.getName());
        return ResponseEntity.ok(dto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/me")
    public ResponseEntity<UserDto> updateCurrentUser(@Validated @RequestBody UserUpdateRequest request,
                                                     Authentication authentication) {
        var dto = userService.updateUserByUsername(authentication.getName(), request);
        return ResponseEntity.ok(dto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUser(Authentication authentication) {
        userService.deleteUserByUsername(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
