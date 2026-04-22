package com.github.bahaaio.wasl.media.model;

import com.github.bahaaio.wasl.comment.model.Comment;
import com.github.bahaaio.wasl.post.model.Post;

import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.*;

/**
 * Represents a media item attached to either a <code>Post</code> or a <code>Comment</code>.
 * <p> Each belongs to exactly one parent (never both). <p>
 * File storage is handled separately from this entity.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
    name = "media",
    check = @CheckConstraint(
        name = "chk_media_parent_not_null",
        constraint = "(post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL)"
    )
)
public class Media {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private Comment comment;

    /**
     * Order of media within its parent.
     * Used for posts (0-based index). Always 0 for comments.
     */
    private int position;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MediaType type;

    @CreationTimestamp
    private Instant createdAt;
}