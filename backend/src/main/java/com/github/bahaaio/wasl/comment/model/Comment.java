package com.github.bahaaio.wasl.comment.model;

import com.github.bahaaio.wasl.post.model.Post;
import com.github.bahaaio.wasl.user.model.User;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    /**
     * parent comment
     * <code>null</code> if comment is a root comment
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent;

    @OneToMany(mappedBy = "parent")
    @BatchSize(size = 50)
    private List<Comment> replies;

    private String content;

    // decentralized score
    @Builder.Default
    private Long score = 0L;

    private boolean deleted;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}