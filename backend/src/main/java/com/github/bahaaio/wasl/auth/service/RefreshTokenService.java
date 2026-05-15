package com.github.bahaaio.wasl.auth.service;

import com.github.bahaaio.wasl.auth.config.RefreshTokenProperties;
import com.github.bahaaio.wasl.auth.exception.InvalidTokenException;
import com.github.bahaaio.wasl.auth.exception.TokenExpiredException;
import com.github.bahaaio.wasl.auth.model.RefreshToken;
import com.github.bahaaio.wasl.auth.repository.RefreshTokenRepository;
import com.github.bahaaio.wasl.user.model.User;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class RefreshTokenService {
    private static final Base64.Encoder encoder = Base64.getEncoder();

    private final RefreshTokenRepository refreshTokenRepository;
    private final SecureRandom secureRandom;
    private final TokenHasher hasher;
    private final RefreshTokenProperties refreshProperties;

    public String createToken(User user) {
        byte[] tokenBytes = new byte[refreshProperties.getTokenByteLength()];
        secureRandom.nextBytes(tokenBytes);

        String encodedToken = encoder.encodeToString(tokenBytes);
        String tokenHash = hasher.hash(encodedToken);

        refreshTokenRepository.save(
            RefreshToken.builder()
                .user(user)
                .tokenHash(tokenHash)
                .expiresAt(Instant.now().plus(refreshProperties.getExpiresIn()))
                .revoked(false)
                .build()
        );

        return encodedToken;
    }

    public User validateAndGetUser(String token) {
        return getRefreshToken(token).getUser();
    }

    @Transactional
    public String rotateToken(String token) {
        var refreshToken = getRefreshToken(token);
        revoke(refreshToken);
        return createToken(refreshToken.getUser());
    }

    public void revokeByToken(String token) {
        var refreshToken = getRefreshToken(token);
        revoke(refreshToken);
    }

    public void revokeAllTokens(String username) {
        refreshTokenRepository.revokeAllTokensByUsername(username);
    }

    public void deleteAllTokensByUserId(Long userId) {
        refreshTokenRepository.deleteAllByUser_Id(userId);
    }

    private RefreshToken getRefreshToken(String token) {
        String tokenHash = hasher.hash(token);

        var refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
            .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));

        if (refreshToken.isRevoked()) {
            throw new InvalidTokenException("Refresh token is revoked");
        }

        if (refreshToken.isExpired()) {
            throw new TokenExpiredException(refreshToken.getExpiresAt());
        }

        return refreshToken;
    }

    private void revoke(RefreshToken refreshToken) {
        if (!refreshToken.isRevoked()) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
        }
    }
}
