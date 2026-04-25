package com.github.bahaaio.wasl.auth.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.verify;

import com.github.bahaaio.wasl.auth.exception.InvalidTokenException;
import com.github.bahaaio.wasl.auth.model.RefreshToken;
import com.github.bahaaio.wasl.auth.repository.RefreshTokenRepository;
import com.github.bahaaio.wasl.user.model.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
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

    @InjectMocks
    RefreshTokenService service;

    User testUser;
    RefreshToken testToken;

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
        doAnswer(inv -> {
            Arrays.fill((byte[]) inv.getArgument(0), (byte) 1);
            return null;
        }).when(secureRandom).nextBytes(any(byte[].class));

        String token = service.createToken(testUser);

        assertNotNull(token);
        verify(repo).save(any(RefreshToken.class));
    }

    @Test
    void shouldThrowWhenRevoked() {
        testToken.setRevoked(true);
        given(repo.findByTokenHash(any())).willReturn(Optional.of(testToken));
        assertThrows(InvalidTokenException.class, () -> service.rotateToken("test"));
    }

    @Test
    void shouldRotateToken() {
        String token = "test";

        given(repo.findByTokenHash(any())).willReturn(Optional.of(testToken));

        var newToken = service.rotateToken(token);
        assertNotNull(newToken);

        assertTrue(testToken.isRevoked());
        verify(repo).save(testToken);
    }

    @Test
    void shouldRevokeByToken() {
        String token = "test";
        String tokenHash = "hashed";
        testToken.setTokenHash(tokenHash);

        given(hasher.hash(token)).willReturn(tokenHash);
        given(repo.findByTokenHash(tokenHash)).willReturn(Optional.of(testToken));
        service.revokeByToken(token);
        assertTrue(testToken.isRevoked());
    }

    @Test
    void shouldRevokeAllTokens() {
        service.revokeAllTokens(testUser);
        verify(repo).revokeAllTokensById(1L);
    }
}