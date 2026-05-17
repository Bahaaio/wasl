package com.github.bahaaio.wasl.community.mapper;

import com.github.bahaaio.wasl.community.dto.response.CommunityMembershipDto;
import com.github.bahaaio.wasl.community.model.CommunityMembership;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommunityMembershipMapper {
    @Mapping(source = "community.id", target = "communityId")
    @Mapping(source = "user.username", target = "username")
    CommunityMembershipDto toDto(CommunityMembership membership);
}
