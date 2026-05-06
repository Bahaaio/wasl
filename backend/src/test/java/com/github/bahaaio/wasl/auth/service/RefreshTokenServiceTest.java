package com.github.bahaaio.wasl.auth.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.doAnswer;

import com.github.bahaaio.wasl.auth.config.RefreshTokenProperties;
import com.github.bahaaio.wasl.auth.exception.InvalidTokenException;
import com.github.bahaaio.wasl.auth.model.RefreshToken;
import com.github.bahaaio.wasl.auth.repository.RefreshTokenRepository;
import com.github.bahaaio.wasl.user.model.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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

        service = new RefreshTokenService(repo, secureRandom, hasher, new RefreshTokenProperties());
    }

    @Test
    void shouldCreateRefreshToken() {
        doAnswer(inv -> {
            Arrays.fill((byte[]) inv.getArgument(0), (byte) 1);
            return null;
        }).when(secureRandom).nextBytes(any(byte[].class));

        String token = service.createToken(testUser);

        assertNotNull(token);
        then(repo).should().save(any(RefreshToken.class));
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
        assertTrue(testToken.isRevoked());
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
        assertEquals(testUser, user);
    }

    @Test
    void shouldRevokeAllTokens() {
        testUser.setUsername("bahaa");
        service.revokeAllTokens(testUser.getUsername());
        then(repo).should().revokeAllTokensByUsername(testUser.getUsername());
    }
}