package com.github.bahaaio.wasl.vote.model;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class CommentVoteId implements Serializable {
    private Long userId;
    private Long commentId;

    @Override
    public final boolean equals(Object o) {
        if (!(o instanceof CommentVoteId that)) return false;

        return userId.equals(that.userId) && commentId.equals(that.commentId);
    }

    @Override
    public int hashCode() {
        int result = userId.hashCode();
        result = 31 * result + commentId.hashCode();
        return result;
    }
}