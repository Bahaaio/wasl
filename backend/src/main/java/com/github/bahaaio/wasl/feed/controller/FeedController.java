package com.github.bahaaio.wasl.feed.controller;

import com.github.bahaaio.wasl.feed.dto.PostFeedResponse;
import com.github.bahaaio.wasl.feed.model.FeedSort;
import com.github.bahaaio.wasl.feed.service.FeedService;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/feed")
public class FeedController {
    private final FeedService feedService;

    @GetMapping
    public ResponseEntity<PostFeedResponse> getFeed(
        Authentication authentication,
        @RequestParam(value = "sort", defaultValue = "latest") FeedSort sort,
        @RequestParam(value = "cursorCreatedAt", required = false) Instant cursorCreatedAt,
        @RequestParam(value = "cursorId", required = false) Long cursorId,
        @RequestParam(value = "cursorScore", required = false) Long cursorScore,
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        var username = authentication != null ? authentication.getName() : null;
        var pageable = Pageable.ofSize(size).withPage(page);

        return ResponseEntity.ok(
            feedService.getFeed(username, sort, cursorCreatedAt, cursorId, cursorScore, pageable)
        );
    }
}
