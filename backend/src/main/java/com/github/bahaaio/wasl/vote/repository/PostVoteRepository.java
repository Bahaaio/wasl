package com.github.bahaaio.wasl.vote.repository;

import com.github.bahaaio.wasl.post.model.Post;
import com.github.bahaaio.wasl.user.model.User;
import com.github.bahaaio.wasl.vote.model.PostVote;
import com.github.bahaaio.wasl.vote.model.PostVoteId;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostVoteRepository extends JpaRepository<PostVote, PostVoteId> {
    Optional<PostVote> findByUserAndPost(User user, Post post);

    void deleteAllByUserId(Long userId);
}
