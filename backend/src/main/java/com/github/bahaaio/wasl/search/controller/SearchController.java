package com.github.bahaaio.wasl.search.controller;

import com.github.bahaaio.wasl.comment.dto.CommentDto;
import com.github.bahaaio.wasl.community.dto.response.CommunityDto;
import com.github.bahaaio.wasl.post.dto.PostDto;
import com.github.bahaaio.wasl.search.model.SearchTime;
import com.github.bahaaio.wasl.search.service.SearchService;
import com.github.bahaaio.wasl.user.dto.UserDto;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/search")
class SearchController {
    private final SearchService searchService;

    @GetMapping("/communities")
    public ResponseEntity<PagedModel<CommunityDto>> searchCommunities(
        @RequestParam(value = "q") String query,
        @ParameterObject Pageable pageable
    ) {
        return ResponseEntity.ok(
            searchService.searchCommunities(query, pageable)
        );
    }

    @GetMapping("/posts")
    public ResponseEntity<PagedModel<PostDto>> searchPosts(
        @RequestParam(value = "q") String query,
        @RequestParam(value = "t", defaultValue = "all") SearchTime time,
        @RequestParam(value = "c", required = false) String community,
        @ParameterObject Pageable pageable
    ) {
        return ResponseEntity.ok(
            searchService.searchPosts(query, community, time, pageable)
        );
    }

    @GetMapping("/comments")
    public ResponseEntity<PagedModel<CommentDto>> searchComments(
        @RequestParam(value = "q") String query,
        @RequestParam(value = "t", defaultValue = "all") SearchTime time,
        @RequestParam(value = "c", required = false) String community,
        @ParameterObject Pageable pageable
    ) {
        return ResponseEntity.ok(
            searchService.searchComments(query, community, time, pageable)
        );
    }

    @GetMapping("/users")
    public ResponseEntity<PagedModel<UserDto>> searchUsers(
        @RequestParam(value = "q") String query,
        @ParameterObject Pageable pageable
    ) {
        return ResponseEntity.ok(
            searchService.searchUsers(query, pageable)
        );
    }
}
