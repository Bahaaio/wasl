package com.github.bahaaio.wasl.comment.dto;

import com.github.bahaaio.wasl.media.dto.MediaDto;
import com.github.bahaaio.wasl.vote.model.VoteAction;

import java.time.Instant;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CommentDto {
    private Long id;
    private String content;

    private String authorUsername;
    private UUID authorAvatarMediaId;

    private Long parentId;
    private Long postId;
    private MediaDto media;

    private VoteAction vote;
    private Long score;
    private boolean hasMoreReplies;
    private boolean deleted;

    private Instant createdAt;
}
