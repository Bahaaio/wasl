package com.github.bahaaio.wasl.community.config;

import com.github.bahaaio.wasl.community.model.CommunityCategory;
import com.github.bahaaio.wasl.community.repository.CommunityCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Seeder to initialize community categories if they don't exist.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class CommunityCategorySeeder implements CommandLineRunner {

    private final CommunityCategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            log.info("Seeding community categories...");
            List<String> categories = List.of(
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

            categories.forEach(name -> {
                CommunityCategory category = new CommunityCategory();
                category.setName(name);
                categoryRepository.save(category);
            });
            log.info("Successfully seeded {} categories.", categories.size());
        }
    }
}