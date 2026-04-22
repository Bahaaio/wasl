package com.github.bahaaio.wasl.community.model;

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
@Table(name = "communities")
public class Community {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CommunityCategory category;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    // denormalized counter
    @Builder.Default
    private Long subscribersCount = 0L;

    @Column(nullable = false)
    private boolean isPublic;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}