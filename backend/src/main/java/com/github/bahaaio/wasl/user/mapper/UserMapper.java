package com.github.bahaaio.wasl.user.mapper;

import com.github.bahaaio.wasl.user.dto.UserDto;
import com.github.bahaaio.wasl.user.model.User;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);
}
