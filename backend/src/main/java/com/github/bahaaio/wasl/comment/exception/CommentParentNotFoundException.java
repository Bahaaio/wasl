package com.github.bahaaio.wasl.comment.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CommentParentNotFoundException extends RuntimeException {
    private final Long id;
}
