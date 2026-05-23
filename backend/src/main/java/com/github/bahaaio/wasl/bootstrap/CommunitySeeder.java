package com.github.bahaaio.wasl.bootstrap;

import com.github.bahaaio.wasl.community.model.Community;
import com.github.bahaaio.wasl.community.model.CommunityCategory;
import com.github.bahaaio.wasl.community.repository.CommunityCategoryRepository;
import com.github.bahaaio.wasl.community.repository.CommunityRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Order(3)
@Component
public class CommunitySeeder implements CommandLineRunner {
    private final CommunityRepository communityRepository;
    private final CommunityCategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (communityRepository.count() > 0) {
            return;
        }

        // Fetch the seeded categories and map them by name for easy lookup
        Map<String, CommunityCategory> categoryMap = categoryRepository.findAll()
            .stream()
            .collect(Collectors.toMap(CommunityCategory::getName, Function.identity()));

        Community javaCommunity = Community.builder()
            .category(categoryMap.get("Programming"))
            .name("Java_Developers")
            .description("A place to discuss Java, Spring Boot, and backend engineering.")
            .subscribersCount(150L)
            .build();

        Community privateCoreTeam = Community.builder()
            .category(categoryMap.get("Technology"))
            .name("Wasl_Core_Team")
            .description("Internal discussions for Wasl maintainers.")
            .subscribersCount(5L)
            .build();

        Community fitnessCommunity = Community.builder()
            .category(categoryMap.get("Health"))
            .name("Desk_Fitness")
            .description("Staying healthy while working remotely.")
            .build();

        communityRepository.saveAll(List.of(javaCommunity, privateCoreTeam, fitnessCommunity));
        log.info("Successfully seeded {} communities.", communityRepository.count());
    }
}