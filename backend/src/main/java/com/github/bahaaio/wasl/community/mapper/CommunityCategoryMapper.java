package com.github.bahaaio.wasl.community.mapper;

import com.github.bahaaio.wasl.community.dto.response.CommunityCategoryDto;
import com.github.bahaaio.wasl.community.model.CommunityCategory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommunityCategoryMapper {
    CommunityCategoryDto toDto(CommunityCategory category);
}
