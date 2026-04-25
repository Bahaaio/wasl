package com.github.bahaaio.wasl.auth.service;

import com.github.bahaaio.wasl.user.model.User;

public interface RefreshTokenService {
    String createToken(User user);

    String rotateToken(String token);

    void revokeByToken(String token);

    void revokeAllTokens(User user);
}
