package com.github.bahaaio.wasl.auth.service;

import com.github.bahaaio.wasl.auth.dto.AuthResponse;
import com.github.bahaaio.wasl.auth.dto.LoginRequest;
import com.github.bahaaio.wasl.auth.dto.RefreshRequest;
import com.github.bahaaio.wasl.auth.dto.RegisterRequest;
import com.github.bahaaio.wasl.auth.exception.ConflictException;
import com.github.bahaaio.wasl.auth.exception.InvalidCredentialsException;
import com.github.bahaaio.wasl.auth.security.JwtService;
import com.github.bahaaio.wasl.user.model.User;
import com.github.bahaaio.wasl.user.model.UserProfile;
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
    public AuthResponse register(RegisterRequest request) {
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

        UserProfile profile = UserProfile.builder()
            .user(user)
            .build();

        user.setProfile(profile);
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
    public AuthResponse login(LoginRequest request) {
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
     * @param request refresh token
     * @return new access token and refresh token pair
     */
    public AuthResponse refresh(RefreshRequest request) {
        var user = refreshTokenService.validateAndGetUser(request.refreshToken());

        String jwt = jwtService.generateToken(user.getUsername());
        String refreshToken = refreshTokenService.rotateToken(request.refreshToken());
        return new AuthResponse(jwt, refreshToken);
    }

    /**
     * Revokes all refresh tokens associated with a user.
     */
    public void logout(String username) {
        refreshTokenService.revokeAllTokens(username);
    }

    private AuthResponse generateTokens(User user) {
        String jwt = jwtService.generateToken(user.getUsername());
        String refreshToken = refreshTokenService.createToken(user);
        return new AuthResponse(jwt, refreshToken);
    }
}
