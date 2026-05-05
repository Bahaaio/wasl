package com.github.bahaaio.wasl.community.dto.response;

import lombok.Builder;

@Builder
public record CommunityCategoryDto(
        Long id,
        String name
) {
}
