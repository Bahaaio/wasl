package com.github.bahaaio.wasl.community.mapper;

import com.github.bahaaio.wasl.community.dto.response.CommunityMembershipDto;
import com.github.bahaaio.wasl.community.model.CommunityMembership;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommunityMembershipMapper {
    @Mapping(target = "communityId", source = "community.id")
    @Mapping(target = "username", source = "user.username")
    CommunityMembershipDto toDto(CommunityMembership membership);
}
