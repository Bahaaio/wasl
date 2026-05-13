package com.github.bahaaio.wasl.comment.dto;

import org.springframework.data.domain.Page;

import java.util.List;

public record CommentFeedResponse(
    List<CommentDto> comments,
    CommentFeedPage page
) {
    public static CommentFeedResponse of(List<CommentDto> comments, Page<?> page) {
        return new CommentFeedResponse(
            comments,
            new CommentFeedPage(
                page.getSize(),
                page.getTotalElements(),
                page.getNumber(),
                page.hasNext()
            )
        );
    }
}

record CommentFeedPage(
    Integer topLevelComments,
    Long totalTopLevelComments,
    Integer number,
    Boolean hasNext
) {
}
