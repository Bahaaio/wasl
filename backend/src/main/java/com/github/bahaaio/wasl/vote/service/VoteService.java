package com.github.bahaaio.wasl.vote.service;

import com.github.bahaaio.wasl.post.repository.PostRepository;
import com.github.bahaaio.wasl.post.service.PostService;
import com.github.bahaaio.wasl.user.service.UserService;
import com.github.bahaaio.wasl.vote.dto.VoteRequest;
import com.github.bahaaio.wasl.vote.model.PostVote;
import com.github.bahaaio.wasl.vote.model.VoteAction;
import com.github.bahaaio.wasl.vote.repository.PostVoteRepository;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class VoteService {
    private final PostService postService;
    private final PostRepository postRepository;
    private final UserService userService;
    private final PostVoteRepository postVoteRepository;

    @Transactional
    public void applyPostVote(Long postId, VoteRequest request, String username) {
        var user = userService.getEntityByUsername(username);
        var post = postService.getEntityById(postId);

        var existingVote = postVoteRepository.findByUserAndPost(user, post).orElse(null);
        var newAction = request.action();
        var requestIsUpvote = newAction.equals(VoteAction.UPVOTE);

        // new vote
        if (existingVote == null) {
            if (newAction.equals(VoteAction.NONE)) return;

            postVoteRepository.save(PostVote.builder()
                .user(user)
                .post(post)
                .upvote(requestIsUpvote)
                .build()
            );

            postRepository.adjustScore(postId, requestIsUpvote ? 1 : -1);
            return;
        }

        // remove existing vote
        if (newAction.equals(VoteAction.NONE)) {
            postVoteRepository.delete(existingVote);
            postRepository.adjustScore(postId, existingVote.isUpvote() ? -1 : 1);
            return;
        }

        // same vote
        if (requestIsUpvote == existingVote.isUpvote()) return;

        // change vote
        existingVote.setUpvote(requestIsUpvote);
        postRepository.adjustScore(postId, requestIsUpvote ? 2 : -2);
    }

    public void deleteAllPostVotesByUsername(String username) {
        var user = userService.getEntityByUsername(username);

        postRepository.adjustAllScoresByUserId(user.getId());
        postVoteRepository.deleteAllByUserId(user.getId());
    }

    public void applyCommentVote(Long id, @Valid VoteRequest request, String username) {
        var user = userService.getEntityByUsername(username);
        // TODO
    }

    public void deleteAllCommentVotesByUsername(String username) {
        var user = userService.getEntityByUsername(username);
        // TODO
    }
}
