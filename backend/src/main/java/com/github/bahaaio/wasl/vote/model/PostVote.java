package com.github.bahaaio.wasl.vote.model;

import com.github.bahaaio.wasl.post.model.Post;
import com.github.bahaaio.wasl.user.model.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "post_vote")
public class PostVote {
    @EmbeddedId
    private PostVoteId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @MapsId("postId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    private boolean upvote;

    public static PostVote of(User user, Post post, boolean upvote) {
        var id = new PostVoteId(user.getId(), post.getId());
        return new PostVote(id, user, post, upvote);
    }
}