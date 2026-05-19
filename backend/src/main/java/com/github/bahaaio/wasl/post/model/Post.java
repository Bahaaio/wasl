package com.github.bahaaio.wasl.post.model;

import com.github.bahaaio.wasl.community.model.Community;
import com.github.bahaaio.wasl.user.model.User;

import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false)
    private String title;

    private String content;

    // denormalized score
    @Builder.Default
    private Long score = 0L;

    // denormalized counter
    @Builder.Default
    private Long commentCount = 0L;

    private boolean deleted;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}