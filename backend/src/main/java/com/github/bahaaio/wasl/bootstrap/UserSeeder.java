package com.github.bahaaio.wasl.bootstrap;

import com.github.bahaaio.wasl.user.model.User;
import com.github.bahaaio.wasl.user.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Order(1)
@Component
public class UserSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        User admin = User.builder()
            .username("bahaa_admin")
            .email("admin@wasl.local")
            .hashedPassword(passwordEncoder.encode("SecurePass123!"))
            .about("System Administrator for Wasl")
            .build();

        User activeUser = User.builder()
            .username("tech_enthusiast")
            .email("user1@wasl.local")
            .hashedPassword(passwordEncoder.encode("UserPass123!"))
            .about("Software engineer who loves open source.")
            .build();

        User minimalistUser = User.builder()
            .username("jane_doe")
            .email("jane@wasl.local")
            .hashedPassword(passwordEncoder.encode("JanePass123!"))
            .build();

        User deletedUser = User.builder()
            .username("old_account")
            .email("deleted@wasl.local")
            .hashedPassword(passwordEncoder.encode("OldPass123!"))
            .deleted(true)
            .build();

        userRepository.saveAll(List.of(admin, activeUser, minimalistUser, deletedUser));
        log.info("Successfully seeded {} users", userRepository.count());
    }
}

