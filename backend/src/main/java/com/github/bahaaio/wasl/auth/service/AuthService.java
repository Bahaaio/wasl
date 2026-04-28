package com.github.bahaaio.wasl.auth.service;

import com.github.bahaaio.wasl.auth.dto.LoginRequest;
import com.github.bahaaio.wasl.auth.dto.RegisterRequest;
import com.github.bahaaio.wasl.auth.exception.ConflictException;
import com.github.bahaaio.wasl.auth.exception.InvalidCredentialsException;
import com.github.bahaaio.wasl.auth.model.AuthResult;
import com.github.bahaaio.wasl.auth.security.JwtService;
import com.github.bahaaio.wasl.user.model.User;
import com.github.bahaaio.wasl.user.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    /**
     * Registers a new user and creates an associated profile.
     *
     * @param request registration data
     * @return issued access token and refresh token
     * @throws ConflictException if the username or email already exists
     */
    public AuthResult register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new ConflictException("Username already in use");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("Email already in use");
        }

        String hashedPassword = passwordEncoder.encode(request.password());

        User user = User.builder()
            .username(request.username())
            .email(request.email())
            .hashedPassword(hashedPassword)
            .build();

        userRepository.save(user);

        return generateTokens(user);
    }

    /**
     * Authenticates a user using their username and password.
     *
     * @param request login credentials
     * @return issued access token and refresh token
     * @throws InvalidCredentialsException if authentication fails
     */
    public AuthResult login(LoginRequest request) {
        var user = userRepository.findByUsername(request.username())
            .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), user.getHashedPassword())) {
            throw new InvalidCredentialsException();
        }

        return generateTokens(user);
    }

    /**
     * Rotates a refresh token and issues a new access token.
     *
     * @param token refresh token
     * @return new access token and refresh token pair
     */
    public AuthResult refresh(String token) {
        var user = refreshTokenService.validateAndGetUser(token);

        String jwt = jwtService.generateToken(user.getUsername());
        String refreshToken = refreshTokenService.rotateToken(token);
        return new AuthResult(jwt, refreshToken);
    }

    /**
     * Revokes the current session associated with the provided refresh token.
     * This logs out a single device/session rather than all user sessions.
     *
     * @param refreshToken the refresh token identifying the session to revoke
     */
    public void logout(String refreshToken) {
        refreshTokenService.revokeByToken(refreshToken);
    }

    private AuthResult generateTokens(User user) {
        String jwt = jwtService.generateToken(user.getUsername());
        String refreshToken = refreshTokenService.createToken(user);
        return new AuthResult(jwt, refreshToken);
    }
}
