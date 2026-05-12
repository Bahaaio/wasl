package com.github.bahaaio.wasl.media.model;

import com.github.bahaaio.wasl.user.model.User;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploader;

    private Long ownerId;

    @Enumerated(EnumType.STRING)
    private MediaOwnerType ownerType;

    @Column(nullable = false)
    private String mimeType;

    /**
     * Order of media within its parent.
     */
    private Integer position;

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