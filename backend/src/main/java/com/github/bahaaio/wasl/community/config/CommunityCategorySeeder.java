package com.github.bahaaio.wasl.community.config;

import com.github.bahaaio.wasl.community.model.CommunityCategory;
import com.github.bahaaio.wasl.community.repository.CommunityCategoryRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Seeder to initialize community categories if they don't exist.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class CommunityCategorySeeder implements CommandLineRunner {
    private static final List<String> CATEGORY_NAMES = List.of(
        "Technology",
        "Gaming",
        "Science",
        "Music",
        "Art",
        "Movies",
        "Books",
        "Sports",
        "Photography",
        "Programming",
        "Education",
        "Finance",
        "Health",
        "Food",
        "Travel"
    );

    private final CommunityCategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            log.info("Seeding community categories...");

            categoryRepository.saveAll(
                CATEGORY_NAMES.stream()
                    .map(CommunityCategory::new)
                    .toList()
            );

            log.info("Successfully seeded {} categories.", CATEGORY_NAMES.size());
        }
    }
}