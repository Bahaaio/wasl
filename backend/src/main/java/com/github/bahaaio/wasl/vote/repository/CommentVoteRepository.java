package com.github.bahaaio.wasl.vote.repository;

import com.github.bahaaio.wasl.vote.model.CommentVote;
import com.github.bahaaio.wasl.vote.model.CommentVoteId;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentVoteRepository extends JpaRepository<CommentVote, CommentVoteId> {
    Optional<CommentVote> findByUser_UsernameAndComment_Id(String username, Long commentId);
}
