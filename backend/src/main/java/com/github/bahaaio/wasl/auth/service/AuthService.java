package com.github.bahaaio.wasl.auth.service;

import com.github.bahaaio.wasl.auth.dto.LoginRequest;
import com.github.bahaaio.wasl.auth.dto.RegisterRequest;
import com.github.bahaaio.wasl.auth.exception.ConflictException;
import com.github.bahaaio.wasl.auth.exception.InvalidCredentialsException;
import com.github.bahaaio.wasl.auth.model.AuthResult;
import com.github.bahaaio.wasl.auth.security.JwtService;
import com.github.bahaaio.wasl.user.exception.UsernameNotFoundException;
import com.github.bahaaio.wasl.user.mapper.UserMapper;
import com.github.bahaaio.wasl.user.model.User;
import com.github.bahaaio.wasl.user.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    /**
     * Registers a new user and returns authentication result.
     *
     * @param request registration data
     * @return authentication result containing tokens and user DTO
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

        return createAuthResult(user);
    }

    /**
     * Authenticates a user using username and password.
     *
     * @param request login credentials
     * @return authentication result containing tokens and user DTO
     * @throws InvalidCredentialsException if authentication fails
     */
    public AuthResult login(LoginRequest request) {
        var user = userRepository.findByUsername(request.username())
            .orElseThrow(() -> new UsernameNotFoundException(request.username()));

        if (!passwordEncoder.matches(request.password(), user.getHashedPassword())) {
            throw new InvalidCredentialsException();
        }

        return createAuthResult(user);
    }

    /**
     * Rotates refresh token and issues new authentication result.
     *
     * @param token refresh token
     * @return authentication result containing new tokens and user DTO
     */
    public AuthResult refresh(String token) {
        var user = refreshTokenService.validateAndGetUser(token);
        var userDto = userMapper.toDto(user);

        String jwt = jwtService.generateToken(user.getUsername());
        String refreshToken = refreshTokenService.rotateToken(token);

        return new AuthResult(jwt, refreshToken, userDto);
    }

    /**
     * Revokes the session associated with the given refresh token.
     * This logs out only the current device/session.
     *
     * @param refreshToken refresh token to revoke
     */
    public void logout(String refreshToken) {
        refreshTokenService.revokeByToken(refreshToken);
    }

    /**
     * Creates <code>AuthResult</code> containing access token,
     * refresh token, and user DTO.
     *
     * @param user authenticated user
     * @return authentication result
     */
    private AuthResult createAuthResult(User user) {
        var userDto = userMapper.toDto(user);

        String jwt = jwtService.generateToken(user.getUsername());
        String refreshToken = refreshTokenService.createToken(user);

        return new AuthResult(jwt, refreshToken, userDto);
    }
}
