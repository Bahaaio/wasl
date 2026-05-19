package com.github.bahaaio.wasl.user.service;

import com.github.bahaaio.wasl.auth.service.RefreshTokenService;
import com.github.bahaaio.wasl.community.service.CommunityMembershipService;
import com.github.bahaaio.wasl.media.service.MediaService;
import com.github.bahaaio.wasl.user.exception.UsernameNotFoundException;
import com.github.bahaaio.wasl.user.repository.UserRepository;
import com.github.bahaaio.wasl.vote.service.VoteDeletionService;

import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserDeletionService {
    private final RefreshTokenService refreshTokenService;
    private final VoteDeletionService voteDeletionService;
    private final MediaService mediaService;
    private final UserRepository userRepository;
    private final CommunityMembershipService communityMembershipService;

    /**
     * Deletes a user account and revokes all active sessions
     *
     * @param username unique username
     */
    @Transactional
    public void deleteUserByUsername(String username) {
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException(username));

        if (user.isDeleted()) return;

        refreshTokenService.deleteAllTokensByUserId(user.getId());
        voteDeletionService.deleteAllVotesByUserId(user.getId());

        // transfer ownership and leave all communities
        communityMembershipService.transferAllUserOwnershipToOldestModerators(user);
        communityMembershipService.leaveAllCommunities(user);

        var mediaIds = Stream.of(user.getAvatarMediaId(), user.getBannerMediaId())
            .filter(Objects::nonNull)
            .collect(Collectors.toUnmodifiableSet());

        // delete user media
        mediaService.deleteAllMediaById(mediaIds);
        user.setAvatarMediaId(null);
        user.setBannerMediaId(null);

        // mark as deleted
        user.setDeleted(true);
        user.setUsername("[deleted-" + user.getId() + "]");
        user.setEmail("deleted_" + user.getId() + "@local");
        user.setHashedPassword("");
    }
}
