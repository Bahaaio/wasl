package com.github.bahaaio.wasl.vote.service;

import com.github.bahaaio.wasl.comment.repository.CommentRepository;
import com.github.bahaaio.wasl.post.repository.PostRepository;
import com.github.bahaaio.wasl.vote.repository.CommentVoteRepository;
import com.github.bahaaio.wasl.vote.repository.PostVoteRepository;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class VoteDeletionService {
    private final PostRepository postRepository;
    private final PostVoteRepository postVoteRepository;
    private final CommentRepository commentRepository;
    private final CommentVoteRepository commentVoteRepository;

    public void deleteAllPostVotesByUserId(Long userId) {
        postRepository.adjustAllScoresByUserId(userId);
        postVoteRepository.deleteAllByUserId(userId);
    }

    public void deleteAllCommentVotesByUserId(Long userId) {
        commentRepository.adjustAllScoresByUserId(userId);
        commentVoteRepository.deleteAllByUserId(userId);
    }

    public void deleteAllVotesByUserId(Long userId) {
        deleteAllPostVotesByUserId(userId);
        deleteAllCommentVotesByUserId(userId);
    }
}
