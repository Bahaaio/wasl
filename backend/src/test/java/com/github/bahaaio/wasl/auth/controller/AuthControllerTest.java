package com.github.bahaaio.wasl.auth.controller;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.github.bahaaio.wasl.auth.dto.LoginRequest;
import com.github.bahaaio.wasl.auth.dto.RegisterRequest;
import com.github.bahaaio.wasl.auth.exception.InvalidCredentialsException;
import com.github.bahaaio.wasl.auth.model.AuthResult;
import com.github.bahaaio.wasl.auth.security.AuthCookieService;
import com.github.bahaaio.wasl.auth.security.JwtFilter;
import com.github.bahaaio.wasl.auth.security.JwtService;
import com.github.bahaaio.wasl.auth.service.AuthService;
import com.github.bahaaio.wasl.user.dto.UserDto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.servlet.http.Cookie;
import tools.jackson.databind.ObjectMapper;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(AuthController.class)
class AuthControllerTest {
    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    AuthService authService;

    @MockitoBean
    AuthCookieService cookieService;

    @MockitoBean
    JwtService jwtService;

    @MockitoBean
    JwtFilter jwtFilter;

    @Autowired
    ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        var userDto = UserDto.builder().username("bahaa").build();
        var authResult = new AuthResult("jwt", "refresh", userDto);

        given(authService.register(any())).willReturn(authResult);
        given(authService.login(any())).willReturn(authResult);
        given(authService.refresh(any())).willReturn(authResult);

        given(cookieService.createRefreshTokenCookie(any()))
            .willReturn(ResponseCookie.from("refresh_token", "refresh").build());

        given(cookieService.deleteRefreshTokenCookie())
            .willReturn(ResponseCookie.from("refresh_token", "").build());
    }

    @Test
    void register_shouldReturnOkWithAccessTokenAndRefreshCookie_whenRequestValid() throws Exception {
        var registerRequest = new RegisterRequest("bahaa", "e@m.c", "12345678");

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken", is("jwt")))
            .andExpect(cookie().value("refresh_token", "refresh"))
            .andExpect(jsonPath("$.user.username").exists());

        verify(authService).register(registerRequest);
    }

    @ParameterizedTest
    @CsvSource({
        "'', e@c.c, valid-password",
        "'-> invalid', e@c.c, valid-password",
        "sh, e@c.c, valid-password",

        "valid, '', valid-password",
        "valid, not-valid, valid-password",

        "valid, val@i.d, ''",
        "valid, val@i.d, short"
    })
    void register_shouldFail_whenInvalidInput(String username, String email, String password) throws Exception {
        var request = new RegisterRequest(username, email, password);

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void login_shouldReturnOkWithAccessTokenAndRefreshCookie_whenRequestValid() throws Exception {
        var loginRequest = new LoginRequest("bahaa", "12345678");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken", is("jwt")))
            .andExpect(cookie().value("refresh_token", "refresh"))
            .andExpect(jsonPath("$.user.username").exists());

        verify(authService).login(loginRequest);
    }

    @Test
    void login_shouldReturnUnauthorized_whenCredentialsInvalid() throws Exception {
        given(authService.login(any()))
            .willThrow(new InvalidCredentialsException());

        var loginRequest = new LoginRequest("bahaa", "wrong_password");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isUnauthorized());
    }

    @ParameterizedTest
    @CsvSource({
        // username
        "'', valid-password",
        "'-> invalid', valid-password",
        "sh, valid-password",
        // password
        "valid, ''",
        "valid, short",
    })
    void login_shouldFail_whenInvalidInput(String username, String password) throws Exception {
        var loginRequest = new LoginRequest(username, password);

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void refresh_shouldReturnOkWithNewAccessTokenAndRefreshCookie_whenRefreshCookieExists() throws Exception {
        mockMvc.perform(post("/api/v1/auth/refresh")
                .cookie(new Cookie("refresh_token", "123")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken").exists())
            .andExpect(cookie().value("refresh_token", not("123")));

        verify(authService).refresh("123");
    }

    @Test
    void refresh_shouldFail_whenRefreshCookieMissing() throws Exception {
        mockMvc.perform(post("/api/v1/auth/refresh"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void logout_shouldReturnNoContentAndClearCookie_whenRefreshCookieExists() throws Exception {
        mockMvc.perform(post("/api/v1/auth/logout")
                .cookie(new Cookie("refresh_token", "refresh")))
            .andExpect(status().isNoContent())
            .andExpect(cookie().value("refresh_token", ""));

        verify(authService).logout("refresh");
    }

    @Test
    void logout_shouldFail_whenRefreshCookieMissing() throws Exception {
        mockMvc.perform(post("/api/v1/auth/logout"))
            .andExpect(status().isBadRequest());
    }
}