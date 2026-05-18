package com.github.bahaaio.wasl.post.repository;

import com.github.bahaaio.wasl.post.model.Post;

import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

import jakarta.transaction.Transactional;

public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("""
        SELECT p FROM Post p
        WHERE
            (LOWER(p.community.name) = LOWER(COALESCE(:communityName, p.community.name)))
            AND (p.createdAt >= COALESCE(:after, p.createdAt))
            AND (
                LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%'))
                OR (LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')))
            )
        """)
    Page<Post> searchPosts(String query, @Nullable String communityName, @Nullable Instant after, Pageable pageable);

    Page<Post> findAllByAuthor_Username(String authorUsername, Pageable pageable);

    @Transactional
    @Modifying
    @Query(value = """
        UPDATE posts
        SET score = score + (
             SELECT CASE WHEN upvote THEN -1 ELSE 1 END
             FROM post_vote pv
             WHERE post_id = posts.id AND user_id = :userId
        )
        WHERE id IN (
            SELECT post_id FROM post_vote WHERE user_id = :userId
        )
        """, nativeQuery = true)
    void adjustAllScoresByUserId(@Param("username") Long userId);

    @Transactional
    @Modifying
    @Query("UPDATE Post p SET p.score = p.score + :delta WHERE p.id = :id")
    void adjustScore(@Param("id") Long id, @Param("delta") int delta);

    @Transactional
    @Modifying
    @Query("UPDATE Post p SET p.commentCount = p.commentCount + :delta WHERE p.id = :id")
    void adjustCommentCount(@Param("id") Long id, @Param("delta") int delta);
}
