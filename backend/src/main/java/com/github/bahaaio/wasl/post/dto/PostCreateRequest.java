package com.github.bahaaio.wasl.post.dto;

import java.util.List;
import java.util.UUID;

public record PostCreateRequest(
    String title,
    String content,
    Long communityId,
    List<UUID> mediaIds
) {
}
