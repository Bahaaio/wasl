package com.github.bahaaio.wasl.vote.model;

import com.github.bahaaio.wasl.comment.model.Comment;
import com.github.bahaaio.wasl.user.model.User;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "comment_vote")
public class CommentVote {
    @EmbeddedId
    private CommentVoteId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @MapsId("commentId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", nullable = false)
    private Comment comment;

    private boolean upvote;
}