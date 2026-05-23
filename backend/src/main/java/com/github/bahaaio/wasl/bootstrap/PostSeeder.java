package com.github.bahaaio.wasl.bootstrap;

import com.github.bahaaio.wasl.community.model.Community;
import com.github.bahaaio.wasl.community.repository.CommunityRepository;
import com.github.bahaaio.wasl.post.model.Post;
import com.github.bahaaio.wasl.post.repository.PostRepository;
import com.github.bahaaio.wasl.user.model.User;
import com.github.bahaaio.wasl.user.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Order(4)
@Component
public class PostSeeder implements CommandLineRunner {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;

    @Override
    public void run(String... args) throws Exception {
        if (postRepository.count() > 0) {
            return;
        }

        List<User> users = userRepository.findAll();
        List<Community> communities = communityRepository.findAll();

        User author1 = users.get(0);
        User author2 = users.size() > 1 ? users.get(1) : users.get(0);

        Community community1 = communities.get(0);
        Community community2 = communities.size() > 1 ? communities.get(1) : communities.get(0);

        Post post1 = Post.builder()
            .community(community1)
            .author(author1)
            .title("First steps with Spring Boot 3")
            .content("I am migrating to Spring Boot 3 and wanted to share some tips.")
            .score(42L)
            .commentCount(5L)
            .build();

        Post post2 = Post.builder()
            .community(community1)
            .author(author2)
            .title("Understanding JPA FetchTypes")
            .content("Lazy loading vs Eager loading in Hibernate.")
            .score(15L)
            .commentCount(2L)
            .build();

        Post post3 = Post.builder()
            .community(community2)
            .author(author1)
            .title("Best standing desks of 2026?")
            .content("Looking for recommendations for a new motorized standing desk.")
            .score(8L)
            .commentCount(1L)
            .build();

        Post post4 = Post.builder()
            .community(community2)
            .author(author2)
            .title("Deleted Post Example")
            .content("This content was removed.")
            .deleted(true)
            .build();

        postRepository.saveAll(List.of(post1, post2, post3, post4));
        log.info("Successfully seeded {} posts.", postRepository.count());
    }
}