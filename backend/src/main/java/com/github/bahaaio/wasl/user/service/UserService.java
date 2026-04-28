package com.github.bahaaio.wasl.user.service;

import com.github.bahaaio.wasl.auth.service.RefreshTokenService;
import com.github.bahaaio.wasl.user.dto.UserDto;
import com.github.bahaaio.wasl.user.dto.UserPatchRequest;
import com.github.bahaaio.wasl.user.mapper.UserMapper;
import com.github.bahaaio.wasl.user.repository.UserRepository;

import org.apache.commons.lang3.StringUtils;
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

    /**
     * Retrieves a user by username.
     *
     * @param username unique username
     * @return the updated user
     * @throws UsernameNotFoundException if the user does not exist
     */
    public UserDto getUserByUsername(String username) {
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));

        return userMapper.toDto(user);
    }

    /**
     * Updates a user by username
     *
     * @param username unique username
     * @param request  request fields to update
     * @return the updated user
     * @throws UsernameNotFoundException if the user does not exist
     */
    public UserDto updateUserByUsername(String username, UserPatchRequest request) {
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));

        if (StringUtils.isNotBlank(request.about())) {
            user.setAbout(request.about());
            userRepository.save(user);
        }

        return userMapper.toDto(user);
    }

    /**
     * Deletes a user account and revokes all active sessions
     *
     * @param username unique username
     */
    @Transactional
    public void deleteUserByUsername(String username) {
        refreshTokenService.deleteAllTokens(username);

        // TODO: soft delete
        userRepository.deleteByUsername(username);

        // TODO: mark content as deleted
        // TODO: delete media
    }
}
