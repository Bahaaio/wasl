package com.github.bahaaio.wasl.bootstrap;

import com.github.bahaaio.wasl.comment.model.Comment;
import com.github.bahaaio.wasl.comment.repository.CommentRepository;
import com.github.bahaaio.wasl.post.model.Post;
import com.github.bahaaio.wasl.post.repository.PostRepository;
import com.github.bahaaio.wasl.user.model.User;
import com.github.bahaaio.wasl.user.repository.UserRepository;
import com.github.bahaaio.wasl.vote.model.CommentVote;
import com.github.bahaaio.wasl.vote.model.PostVote;
import com.github.bahaaio.wasl.vote.repository.CommentVoteRepository;
import com.github.bahaaio.wasl.vote.repository.PostVoteRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Order(6)
@Component
public class VoteSeeder implements CommandLineRunner {
    private final PostVoteRepository postVoteRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentVoteRepository commentVoteRepository;
    private final CommentRepository commentRepository;

    @Override
    public void run(String... args) throws Exception {
        seedPostVotes();
        seedCommentVotes();
    }

    void seedPostVotes() {
        if (postVoteRepository.count() > 0) {
            return;
        }

        List<User> users = userRepository.findAll();
        List<Post> posts = postRepository.findAll();

        if (users.isEmpty() || posts.isEmpty()) {
            log.warn("Cannot seed post votes. Missing users or posts.");
            return;
        }

        User user1 = users.get(0);
        User user2 = users.size() > 1 ? users.get(1) : users.get(0);
        User user3 = users.size() > 2 ? users.get(2) : users.get(0);

        Post post1 = posts.get(0);
        Post post2 = posts.size() > 1 ? posts.get(1) : posts.get(0);
        Post post3 = posts.size() > 2 ? posts.get(2) : posts.get(0);

        PostVote vote1 = PostVote.of(user1, post1, true);
        PostVote vote2 = PostVote.of(user2, post1, true);
        PostVote vote3 = PostVote.of(user3, post1, false);

        PostVote vote4 = PostVote.of(user1, post2, false);
        PostVote vote5 = PostVote.of(user2, post2, true);

        PostVote vote6 = PostVote.of(user2, post3, true);

        postVoteRepository.saveAll(List.of(vote1, vote2, vote3, vote4, vote5, vote6));

        log.info("Successfully seeded {} post votes.", postVoteRepository.count());
    }

    void seedCommentVotes() {
        if (commentVoteRepository.count() > 0) {
            return;
        }

        List<User> users = userRepository.findAll();
        List<Comment> comments = commentRepository.findAll();

        if (users.isEmpty() || comments.isEmpty()) {
            log.warn("Cannot seed comment votes. Missing users or comments.");
            return;
        }

        User user1 = users.get(0);
        User user2 = users.size() > 1 ? users.get(1) : users.get(0);
        User user3 = users.size() > 2 ? users.get(2) : users.get(0);

        Comment comment1 = comments.get(0);
        Comment comment2 = comments.size() > 1 ? comments.get(1) : comments.get(0);
        Comment comment3 = comments.size() > 2 ? comments.get(2) : comments.get(0);

        CommentVote vote1 = CommentVote.of(user1, comment1, true);
        CommentVote vote2 = CommentVote.of(user2, comment1, true);
        CommentVote vote3 = CommentVote.of(user3, comment1, false);

        CommentVote vote4 = CommentVote.of(user1, comment2, false);
        CommentVote vote5 = CommentVote.of(user2, comment2, true);

        CommentVote vote6 = CommentVote.of(user1, comment3, true);

        commentVoteRepository.saveAll(List.of(vote1, vote2, vote3, vote4, vote5, vote6));

        log.info("Successfully seeded {} comment votes.", commentVoteRepository.count());
    }
}