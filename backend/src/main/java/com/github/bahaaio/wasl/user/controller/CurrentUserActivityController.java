package com.github.bahaaio.wasl.user.controller;

import com.github.bahaaio.wasl.post.dto.PostDto;
import com.github.bahaaio.wasl.vote.service.VoteService;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users/me")
public class CurrentUserActivityController {
    private final VoteService voteService;

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{username}/upvoted")
    public ResponseEntity<PagedModel<PostDto>> listUpvotedPosts(@PathVariable String username,
                                                                @ParameterObject Pageable pageable) {
        var postDtoPagedModel = voteService.listVotedPostsByUsername(username, true, pageable);
        return ResponseEntity.ok(postDtoPagedModel);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{username}/downvoted")
    public ResponseEntity<PagedModel<PostDto>> listDownvotedPosts(@PathVariable String username,
                                                                  @ParameterObject Pageable pageable) {
        var postDtoPagedModel = voteService.listVotedPostsByUsername(username, false, pageable);
        return ResponseEntity.ok(postDtoPagedModel);
    }
}
