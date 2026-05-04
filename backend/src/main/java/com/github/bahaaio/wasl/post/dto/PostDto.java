package com.github.bahaaio.wasl.post.dto;

import com.github.bahaaio.wasl.media.dto.MediaDto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import lombok.Builder;

@Builder
public record PostDto(
    Long id,
    String title,
    String content,

    String authorUsername,
    UUID authorAvatarMediaId,

    Long communityId,
    String communityName,
    List<MediaDto> media,

    // -1, 0, 1
    int userVote,
    long score,
    long commentCount,
    boolean deleted,

    Instant createdAt
) {
}
