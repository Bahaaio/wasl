package com.github.bahaaio.wasl.user.service;

import com.github.bahaaio.wasl.auth.service.RefreshTokenService;
import com.github.bahaaio.wasl.user.dto.UserDto;
import com.github.bahaaio.wasl.user.dto.UserUpdateRequest;
import com.github.bahaaio.wasl.user.mapper.UserMapper;
import com.github.bahaaio.wasl.user.repository.UserRepository;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RefreshTokenService refreshTokenService;

    public UserDto getUserByUsername(String username) {
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));

        return userMapper.toDto(user);
    }

    public UserDto updateUserByUsername(String username, UserUpdateRequest request) {
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));

        user.setAbout(request.about());
        userRepository.save(user);

        return userMapper.toDto(user);
    }

    @Transactional
    public void deleteUserByUsername(String username) {
        refreshTokenService.deleteAllTokens(username);

        // TODO: soft delete
        userRepository.deleteByUsername(username);

        // TODO: mark content as deleted
        // TODO: delete media
    }
}
