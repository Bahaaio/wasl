package com.github.bahaaio.wasl.bootstrap;

import com.github.bahaaio.wasl.comment.model.Comment;
import com.github.bahaaio.wasl.comment.repository.CommentRepository;
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
@Order(5)
@Component
public class CommentSeeder implements CommandLineRunner {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Override
    public void run(String... args) throws Exception {
        if (commentRepository.count() > 0) {
            return;
        }

        List<User> users = userRepository.findAll();
        List<Post> posts = postRepository.findAll();

        if (users.isEmpty() || posts.isEmpty()) {
            log.warn("Cannot seed comments. Missing users or posts.");
            return;
        }

        User user1 = users.get(0);
        User user2 = users.size() > 1 ? users.get(1) : users.get(0);

        Post post1 = posts.get(0);
        Post post2 = posts.size() > 1 ? posts.get(1) : posts.get(0);

        Comment rootComment1 = Comment.builder()
            .author(user2)
            .post(post1)
            .content("Thanks for the tips! Migration is always tricky.")
            .score(12L)
            .build();
        commentRepository.save(rootComment1);

        Comment child1_1 = Comment.builder()
            .author(user1)
            .post(post1)
            .parent(rootComment1)
            .content("Let me know if you hit any roadblocks.")
            .score(5L)
            .build();
        commentRepository.save(child1_1);

        Comment child1_1_1 = Comment.builder()
            .author(user2)
            .post(post1)
            .parent(child1_1)
            .content("Will do, much appreciated!")
            .score(2L)
            .build();
        commentRepository.save(child1_1_1);

        Comment rootComment2 = Comment.builder()
            .author(user1)
            .post(post2)
            .content("I default to lazy loading for almost everything.")
            .score(20L)
            .build();
        commentRepository.save(rootComment2);

        Comment child2_1 = Comment.builder()
            .author(user2)
            .post(post2)
            .parent(rootComment2)
            .content("Agreed, eager loading easily leads to N+1 problems.")
            .score(8L)
            .build();
        commentRepository.save(child2_1);

        Comment child2_2 = Comment.builder()
            .author(user1)
            .post(post2)
            .parent(rootComment2)
            .content("Exactly, EntityGraphs are better when eager is actually needed.")
            .score(15L)
            .build();
        commentRepository.save(child2_2);

        Comment deletedComment = Comment.builder()
            .author(user2)
            .post(post1)
            .content(null)
            .deleted(true)
            .build();
        commentRepository.save(deletedComment);

        log.info("Successfully seeded {} comments.", commentRepository.count());
    }
}