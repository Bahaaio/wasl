package com.github.bahaaio.wasl.comment.repository;

import com.github.bahaaio.wasl.comment.model.Comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

import jakarta.transaction.Transactional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // only search top level comments
    @Query("""
        SELECT c FROM Comment c
        WHERE
            (c.parent IS NULL)
            AND (LOWER(c.post.community.name) = LOWER(COALESCE(:communityName, c.post.community.name)))
            AND (c.createdAt >= COALESCE(:after, c.createdAt))
            AND (LOWER(c.content) LIKE LOWER(CONCAT('%', :query, '%')))
        """)
    Page<Comment> searchComments(String query, String communityName, Instant after, Pageable pageable);

    Page<Comment> findAllByAuthor_Username(String username, Pageable pageable);

    Page<Comment> findAllByPost_IdAndParentIsNull(Long postId, Pageable pageable);

    @Transactional
    @Modifying
    @Query(value = """
        UPDATE comments
        SET score = score + (
             SELECT CASE WHEN upvote THEN -1 ELSE 1 END
             FROM comment_vote cv
             WHERE comment_id = comments.id AND user_id = :userId
        )
        WHERE id IN (
            SELECT comment_id FROM comment_vote WHERE user_id = :userId
        )
        """, nativeQuery = true)
    void adjustAllScoresByUserId(@Param("userId") Long userId);

    @Transactional
    @Modifying
    @Query("UPDATE Comment c SET c.score = c.score + :delta WHERE c.id = :id")
    void adjustScore(@Param("id") Long id, @Param("delta") int delta);
}
