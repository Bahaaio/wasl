package com.github.bahaaio.wasl.post.repository;

import com.github.bahaaio.wasl.post.model.Post;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
