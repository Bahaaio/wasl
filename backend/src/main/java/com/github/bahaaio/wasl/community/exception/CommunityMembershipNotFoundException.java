package com.github.bahaaio.wasl.community.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CommunityMembershipNotFoundException extends RuntimeException {
    private final Long id;
}
