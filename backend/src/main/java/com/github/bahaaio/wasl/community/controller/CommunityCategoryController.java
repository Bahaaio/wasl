package com.github.bahaaio.wasl.community.controller;

import com.github.bahaaio.wasl.community.dto.response.CommunityCategoryDto;
import com.github.bahaaio.wasl.community.service.CommunityCategoryService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/community-categories")
@RequiredArgsConstructor
public class CommunityCategoryController {
    private final CommunityCategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CommunityCategoryDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
}
