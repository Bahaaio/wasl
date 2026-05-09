package com.github.bahaaio.wasl.vote.repository;

import com.github.bahaaio.wasl.post.model.Post;
import com.github.bahaaio.wasl.vote.model.PostVote;
import com.github.bahaaio.wasl.vote.model.PostVoteId;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PostVoteRepository extends JpaRepository<PostVote, PostVoteId> {
    Optional<PostVote> findByUser_UsernameAndPost_Id(String username, Long postId);

    void deleteAllByUserId(Long userId);

    @Query("SELECT pv.post FROM PostVote pv WHERE pv.user.username = :username AND pv.upvote = :upvoted")
    Page<Post> findPostsByUsernameAndVote(String username, boolean upvoted, Pageable pageable);
}
