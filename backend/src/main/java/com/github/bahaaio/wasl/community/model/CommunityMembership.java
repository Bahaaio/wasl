package com.github.bahaaio.wasl.community.model;

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
@Table(name = "community_memberships")
public class CommunityMembership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    private Community community;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommunityRole role;

    @CreationTimestamp
    private Instant createdAt;
}