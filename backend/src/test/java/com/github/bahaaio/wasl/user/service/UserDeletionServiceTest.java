package com.github.bahaaio.wasl.user.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.github.bahaaio.wasl.auth.service.RefreshTokenService;
import com.github.bahaaio.wasl.community.service.CommunityMembershipService;
import com.github.bahaaio.wasl.media.service.MediaService;
import com.github.bahaaio.wasl.user.model.User;
import com.github.bahaaio.wasl.user.repository.UserRepository;
import com.github.bahaaio.wasl.vote.service.VoteDeletionService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@ExtendWith(MockitoExtension.class)
class UserDeletionServiceTest {
    @Mock
    UserRepository userRepository;

    @Mock
    CommunityMembershipService communityMembershipService;

    @Mock
    RefreshTokenService refreshTokenService;

    @Mock
    VoteDeletionService voteDeletionService;

    @Mock
    MediaService mediaService;

    @InjectMocks
    UserDeletionService userDeletionService;

    @Test
    void testDeleteUserByUsername() {
        User testUser = User.builder()
            .id(1L)
            .username("test")
            .avatarMediaId(UUID.randomUUID())
            .bannerMediaId(UUID.randomUUID())
            .build();

        var oldMediaIds = Set.of(testUser.getAvatarMediaId(), testUser.getBannerMediaId());
        given(userRepository.findByUsername("test")).willReturn(Optional.of(testUser));

        userDeletionService.deleteUserByUsername("test");

        assertThat(testUser.getAvatarMediaId()).isNull();
        assertThat(testUser.getBannerMediaId()).isNull();
        assertThat(testUser.isDeleted());
        assertThat(testUser.getUsername()).isEqualTo("[deleted-1]");
        assertThat(testUser.getEmail()).isEqualTo("deleted_1@local");
        assertThat(testUser.getHashedPassword()).isEqualTo("");

        then(refreshTokenService).should().deleteAllTokensByUserId(1L);
        then(voteDeletionService).should().deleteAllVotesByUserId(1L);
        then(mediaService).should().deleteAllMediaById(oldMediaIds);
        then(communityMembershipService).should().transferAllUserOwnershipToOldestModerators(testUser);
        then(communityMembershipService).should().leaveAllCommunities(testUser);
    }
}