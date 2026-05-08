package com.github.bahaaio.wasl.vote.repository;

import com.github.bahaaio.wasl.post.model.Post;
import com.github.bahaaio.wasl.user.model.User;
import com.github.bahaaio.wasl.vote.model.PostVote;
import com.github.bahaaio.wasl.vote.model.PostVoteId;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PostVoteRepository extends JpaRepository<PostVote, PostVoteId> {
    Optional<PostVote> findByUserAndPost(User user, Post post);

    void deleteAllByUserId(Long userId);

    @Query("SELECT pv.post FROM PostVote pv WHERE pv.user.id = :username AND pv.upvote = :upvote")
    Page<Post> findPostsByUserNameAndVote(@Param("username") String username, @Param("upvote") boolean upvote,
                                          Pageable pageable);
}
