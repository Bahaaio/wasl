package com.github.bahaaio.wasl.auth.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;

import com.github.bahaaio.wasl.auth.config.RefreshTokenProperties;
import com.github.bahaaio.wasl.auth.exception.InvalidTokenException;
import com.github.bahaaio.wasl.auth.model.RefreshToken;
import com.github.bahaaio.wasl.auth.repository.RefreshTokenRepository;
import com.github.bahaaio.wasl.user.model.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {
    @Mock
    SecureRandom secureRandom;

    @Mock
    RefreshTokenRepository repo;

    @Mock
    TokenHasher hasher;

    @Spy
    RefreshTokenProperties refreshProperties = new RefreshTokenProperties();

    @InjectMocks
    RefreshTokenService service;

    User testUser;
    RefreshToken testToken;

    @Captor
    ArgumentCaptor<RefreshToken> refreshTokenCaptor;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(1L)
            .build();

        testToken = RefreshToken.builder()
            .user(testUser)
            .revoked(false)
            .expiresAt(Instant.now().plus(Duration.ofDays(7)))
            .build();
    }

    @Test
    void shouldCreateRefreshToken() {
        String tokenHash = "hashed";

        willAnswer(inv -> {
            Arrays.fill((byte[]) inv.getArgument(0), (byte) 1);
            return null;
        }).given(secureRandom).nextBytes(any(byte[].class));
        given(hasher.hash(any())).willReturn(tokenHash);

        String token = service.createToken(testUser);

        assertThat(token).isNotBlank();

        then(repo).should().save(refreshTokenCaptor.capture());
        var savedToken = refreshTokenCaptor.getValue();

        assertThat(savedToken.getUser()).isEqualTo(testUser);
        assertThat(savedToken.getTokenHash()).isEqualTo(tokenHash);
        assertThat(savedToken.isRevoked()).isFalse();
        assertThat(savedToken.isExpired()).isFalse();
    }

    @Test
    void shouldThrowWhenRevoked() {
        testToken.setRevoked(true);

        given(repo.findByTokenHash(any())).willReturn(Optional.of(testToken));

        assertThatThrownBy(() -> service.rotateToken("test"))
            .isInstanceOf(InvalidTokenException.class);
    }

    @Test
    void shouldRotateToken() {
        String token = "test";

        given(repo.findByTokenHash(any())).willReturn(Optional.of(testToken));

        var newToken = service.rotateToken(token);

        assertThat(newToken).isNotNull();
        assertThat(newToken).isNotEqualTo(token);
        assertThat(testToken.isRevoked()).isTrue();

        then(repo).should().save(testToken);
    }

    @Test
    void shouldRevokeByToken() {
        String token = "test";
        String tokenHash = "hashed";
        testToken.setTokenHash(tokenHash);

        given(hasher.hash(token)).willReturn(tokenHash);
        given(repo.findByTokenHash(tokenHash)).willReturn(Optional.of(testToken));

        service.revokeByToken(token);

        assertThat(testToken.isRevoked()).isTrue();

        then(repo).should().save(testToken);
    }

    @Test
    void shouldValidateAndReturnUser() {
        String token = "test";
        String tokenHash = "hashed";
        testToken.setTokenHash(tokenHash);

        given(hasher.hash(token)).willReturn(tokenHash);
        given(repo.findByTokenHash(tokenHash)).willReturn(Optional.of(testToken));

        var user = service.validateAndGetUser("test");

        then(hasher).should().hash(token);
        then(repo).should().findByTokenHash(tokenHash);

        assertThat(testToken.isRevoked()).isFalse();
        assertThat(testToken.getUser()).isEqualTo(user);
    }

    @Test
    void shouldRevokeAllTokens() {
        testUser.setUsername("bahaa");

        service.revokeAllTokens(testUser.getUsername());

        then(repo).should().revokeAllTokensByUsername(testUser.getUsername());
    }
}