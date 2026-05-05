package com.github.bahaaio.wasl.community.controller;

import com.github.bahaaio.wasl.community.dto.request.CommunityCategoryCreateRequest;
import com.github.bahaaio.wasl.community.dto.response.CommunityCategoryDto;
import com.github.bahaaio.wasl.community.service.CommunityCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/community-categories")
@RequiredArgsConstructor
public class CommunityCategoryController {

    private final CommunityCategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CommunityCategoryDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping
    public ResponseEntity<CommunityCategoryDto> createCategory(
            @Valid @RequestBody CommunityCategoryCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(request, userDetails.getUsername()));
    }
}
