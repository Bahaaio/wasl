package com.github.bahaaio.wasl.vote.model;

import com.github.bahaaio.wasl.comment.model.Comment;
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

    public static CommentVote of(User user, Comment comment, boolean upvote) {
        var id = new CommentVoteId(user.getId(), comment.getId());
        return new CommentVote(id, user, comment, upvote);
    }
}
