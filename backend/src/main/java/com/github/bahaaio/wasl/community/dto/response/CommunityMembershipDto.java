package com.github.bahaaio.wasl.community.dto.response;

import com.github.bahaaio.wasl.community.model.CommunityRole;
import lombok.Builder;

import java.time.Instant;

@Builder
public record CommunityMembershipDto(
        long id,
        long communityId,
        String username,
        CommunityRole role,
        Instant createdAt
) {
}
