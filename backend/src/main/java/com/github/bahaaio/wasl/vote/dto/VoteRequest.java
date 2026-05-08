package com.github.bahaaio.wasl.vote.dto;

import com.github.bahaaio.wasl.vote.model.VoteAction;

import jakarta.validation.constraints.NotNull;

public record VoteRequest(
    @NotNull
    VoteAction action
) {
}
