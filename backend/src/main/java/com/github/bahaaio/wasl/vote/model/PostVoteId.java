package com.github.bahaaio.wasl.vote.model;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class PostVoteId implements Serializable {
    private Long userId;
    private Long postId;

    @Override
    public final boolean equals(Object o) {
        if (!(o instanceof PostVoteId that)) return false;

        return userId.equals(that.userId) && postId.equals(that.postId);
    }

    @Override
    public int hashCode() {
        int result = userId.hashCode();
        result = 31 * result + postId.hashCode();
        return result;
    }
}