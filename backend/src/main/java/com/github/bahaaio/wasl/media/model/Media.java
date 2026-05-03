package com.github.bahaaio.wasl.media.model;

import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.*;

/**
 * Represents a media item attached to a <code>MediaOwnerType</code>
 * <p>
 * File storage is handled separately from this entity.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "media")
public class Media {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false)
    private UUID id;

    @Column(nullable = false)
    private Long ownerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MediaOwnerType ownerType;

    /**
     * Order of media within its parent.
     * Used for posts (0-based index). Always 0 for comments.
     */
    private int position;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MediaType type;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MediaState state = MediaState.TEMP;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}