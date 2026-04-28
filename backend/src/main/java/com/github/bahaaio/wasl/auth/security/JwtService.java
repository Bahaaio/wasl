package com.github.bahaaio.wasl.auth.security;

import com.github.bahaaio.wasl.auth.config.JwtTokenProperties;

import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@Component
public class JwtService {
    private final JwtTokenProperties jwtProperties;

    public String generateToken(String username) {
        return Jwts.builder()
            .subject(username)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + jwtProperties.getExpirationMs()))
            .signWith(getKey())
            .compact();
    }

    public String extractUsername(String token) {
        try {
            return Jwts.parser()
                .verifyWith((SecretKey) getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        } catch (JwtException ex) {
            log.debug("failed to parse jwt: {}", ex.getMessage());
            throw ex;
        }
    }

    private Key getKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes());
    }
}
