package com.github.bahaaio.wasl.post.dto;

import com.github.bahaaio.wasl.media.dto.MediaDto;
import com.github.bahaaio.wasl.vote.model.VoteAction;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import lombok.Builder;

@Builder
public record PostDto(
    long id,
    String title,
    String content,

    String authorUsername,
    UUID authorAvatarMediaId,

    long communityId,
    String communityName,
    List<MediaDto> media,

    VoteAction vote,
    long score,
    long commentCount,
    boolean deleted,

    Instant createdAt
) {
}
