package com.github.bahaaio.wasl.user.exception;

public class UsernameNotFoundException extends RuntimeException {
    public UsernameNotFoundException(String username) {
        super("Username not found: " + username);
    }
}
