package com.github.bahaaio.wasl.vote.model;

import com.github.bahaaio.wasl.post.model.Post;
import com.github.bahaaio.wasl.user.model.User;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
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
}