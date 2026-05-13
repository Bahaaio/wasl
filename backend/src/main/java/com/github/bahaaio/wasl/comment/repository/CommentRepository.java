package com.github.bahaaio.wasl.comment.repository;

import com.github.bahaaio.wasl.comment.model.Comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findAllByPost_Id(Long postId, Pageable pageable);

    Page<Comment> findAllByPost_IdAndParentIsNull(Long postId, Pageable pageable);
}
