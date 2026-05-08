package com.github.bahaaio.wasl.vote.repository;

import com.github.bahaaio.wasl.vote.model.CommentVote;
import com.github.bahaaio.wasl.vote.model.CommentVoteId;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentVoteRepository extends JpaRepository<CommentVote, CommentVoteId> {
}
