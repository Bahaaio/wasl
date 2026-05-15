package com.github.bahaaio.wasl.user.service;

import com.github.bahaaio.wasl.auth.service.RefreshTokenService;
import com.github.bahaaio.wasl.user.dto.UserDto;
import com.github.bahaaio.wasl.user.dto.UserPatchRequest;
import com.github.bahaaio.wasl.user.exception.UsernameNotFoundException;
import com.github.bahaaio.wasl.user.mapper.UserMapper;
import com.github.bahaaio.wasl.user.model.User;
import com.github.bahaaio.wasl.user.repository.UserRepository;
import com.github.bahaaio.wasl.vote.service.VoteDeletionService;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RefreshTokenService refreshTokenService;
    private final VoteDeletionService voteDeletionService;

    /**
     * Retrieves a user by username.
     *
     * @param username unique username
     * @return the user DTO
     * @throws UsernameNotFoundException if the user does not exist
     */
    public UserDto getUserByUsername(String username) {
        var user = getEntityByUsername(username);
        return userMapper.toDto(user);
    }

    /**
     * Retrieves a user database entity by username.
     *
     * @param username unique username
     * @return the user entity
     * @throws UsernameNotFoundException if the user does not exist
     */
    public User getEntityByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException(username));
    }

    /**
     * Verifies if a user exists in the repository based on the provided username.
     *
     * @param username the unique username to check for existence
     * @throws UsernameNotFoundException if the user with the specified username does not exist
     */
    public void verifyUserExists(String username) {
        if (!userRepository.existsByUsername(username)) {
            throw new UsernameNotFoundException(username);
        }
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
        var user = getEntityByUsername(username);

        if (StringUtils.isNotBlank(request.about())) {
            user.setAbout(request.about());
            user = userRepository.save(user);
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
        var user = getEntityByUsername(username);

        refreshTokenService.deleteAllTokensByUserId(user.getId());
        voteDeletionService.deleteAllVotesByUserId(user.getId());

        // TODO: delete media
        // TODO: mark content as deleted

        // TODO: soft delete
        userRepository.deleteById(user.getId());
    }
}
