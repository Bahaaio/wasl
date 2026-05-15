package com.github.bahaaio.wasl.user.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

import com.github.bahaaio.wasl.auth.service.RefreshTokenService;
import com.github.bahaaio.wasl.user.dto.UserPatchRequest;
import com.github.bahaaio.wasl.user.exception.UsernameNotFoundException;
import com.github.bahaaio.wasl.user.mapper.UserMapper;
import com.github.bahaaio.wasl.user.model.User;
import com.github.bahaaio.wasl.user.repository.UserRepository;
import com.github.bahaaio.wasl.vote.service.VoteDeletionService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    UserRepository userRepository;

    @Spy
    UserMapper userMapper = Mappers.getMapper(UserMapper.class);

    @Mock
    RefreshTokenService refreshTokenService;

    @Mock
    VoteDeletionService voteDeletionService;

    @InjectMocks
    UserService userService;

    @Captor
    ArgumentCaptor<User> userCaptor;

    User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).username("test").build();
    }

    @Test
    void testGetUserByUsername() {
        given(userRepository.findByUsername("test")).willReturn(Optional.of(testUser));

        var userDto = userService.getUserByUsername("test");

        assertThat(userDto).isNotNull();
        assertThat(userDto.username()).isEqualTo("test");
    }

    @Test
    void testGetEntityByUsername() {
        given(userRepository.findByUsername("test")).willReturn(Optional.of(testUser));

        var user = userService.getEntityByUsername("test");

        assertThat(user).isNotNull();
        assertThat(user.getUsername()).isEqualTo("test");
    }

    @Test
    void testGetEntityByUsernameNotFound() {
        given(userRepository.findByUsername("notfound")).willReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getEntityByUsername("notfound"))
            .isInstanceOf(UsernameNotFoundException.class);
    }

    @Test
    void testUpdateUserByUsername() {
        given(userRepository.findByUsername("test")).willReturn(Optional.of(testUser));

        var request = new UserPatchRequest("new about");
        given(userRepository.save(any())).willReturn(testUser);

        var updatedDto = userService.updateUserByUsername("test", request);

        assertThat(updatedDto.username()).isEqualTo("test");
        assertThat(updatedDto.about()).isEqualTo("new about");

        then(userRepository).should().save(userCaptor.capture());
        assertThat(userCaptor.getValue().getAbout()).isEqualTo("new about");
    }

    @Test
    void testUpdateUserByUsernameBlankAbout() {
        given(userRepository.findByUsername("test")).willReturn(Optional.of(testUser));

        testUser.setAbout("old about");
        var request = new UserPatchRequest("  ");
        var updatedDto = userService.updateUserByUsername("test", request);

        assertThat(updatedDto.username()).isEqualTo("test");
        assertThat(updatedDto.about()).isEqualTo("old about");

        then(userRepository).should(never()).save(any());
    }

    @Test
    void testDeleteUserByUsername() {
        given(userRepository.findByUsername("test")).willReturn(Optional.of(testUser));

        userService.deleteUserByUsername("test");

        then(userRepository).should().deleteById(1L);
        then(refreshTokenService).should().deleteAllTokensByUserId(1L);
        then(voteDeletionService).should().deleteAllVotesByUserId(1L);
    }
}