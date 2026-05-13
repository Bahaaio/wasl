package com.github.bahaaio.wasl.vote.service;

import com.github.bahaaio.wasl.media.model.MediaOwnerType;
import com.github.bahaaio.wasl.media.service.MediaService;
import com.github.bahaaio.wasl.post.dto.PostDto;
import com.github.bahaaio.wasl.post.exception.PostNotFoundException;
import com.github.bahaaio.wasl.post.mapper.PostMapper;
import com.github.bahaaio.wasl.post.repository.PostRepository;
import com.github.bahaaio.wasl.user.service.UserService;
import com.github.bahaaio.wasl.vote.dto.VoteRequest;
import com.github.bahaaio.wasl.vote.model.PostVote;
import com.github.bahaaio.wasl.vote.model.VoteAction;
import com.github.bahaaio.wasl.vote.repository.CommentVoteRepository;
import com.github.bahaaio.wasl.vote.repository.PostVoteRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class VoteService {
    private final PostRepository postRepository;
    private final UserService userService;
    private final PostVoteRepository postVoteRepository;
    private final PostMapper postMapper;
    private final MediaService mediaService;
    private final CommentVoteRepository commentVoteRepository;

    public VoteAction getPostVoteByUsername(Long postId, String username) {
        userService.verifyUserExists(username);

        return postVoteRepository.findByUser_UsernameAndPost_Id(username, postId)
            .map(postVote -> postVote.isUpvote() ? VoteAction.UPVOTE : VoteAction.DOWNVOTE)
            .orElse(VoteAction.NONE);
    }

    @Transactional
    public void applyPostVote(Long postId, VoteRequest request, String username) {
        var user = userService.getEntityByUsername(username);
        var post = postRepository.findById(postId)
            .orElseThrow(() -> new PostNotFoundException(postId));

        var existingVote = postVoteRepository.findByUser_UsernameAndPost_Id(user.getUsername(), post.getId())
            .orElse(null);
        var newAction = request.action();
        var requestIsUpvote = newAction.equals(VoteAction.UPVOTE);

        // new vote
        if (existingVote == null) {
            if (newAction.equals(VoteAction.NONE)) return;

            postVoteRepository.save(
                PostVote.of(user, post, requestIsUpvote)
            );

            postRepository.adjustScore(postId, requestIsUpvote ? 1 : -1);
            return;
        }

        // remove existing vote
        if (newAction.equals(VoteAction.NONE)) {
            postVoteRepository.delete(existingVote);
            postRepository.adjustScore(postId, existingVote.isUpvote() ? -1 : 1);
            return;
        }

        // same vote
        if (requestIsUpvote == existingVote.isUpvote()) return;

        // change vote
        existingVote.setUpvote(requestIsUpvote);
        postRepository.adjustScore(postId, requestIsUpvote ? 2 : -2);
    }

    public PagedModel<PostDto> listVotedPostsByUsername(String username, boolean upvoted, Pageable pageable) {
        // TODO: n+1
        Page<PostDto> postDtoPage = postVoteRepository.findPostsByUsernameAndVote(username, upvoted, pageable)
            .map(post -> postMapper.toDto(post, mediaService.getByOwnerId(post.getId(), MediaOwnerType.POST),
                getPostVoteByUsername(post.getId(), username)));

        return new PagedModel<>(postDtoPage);
    }

    public void deleteAllPostVotesByUsername(String username) {
        var user = userService.getEntityByUsername(username);

        postRepository.adjustAllScoresByUserId(user.getId());
        postVoteRepository.deleteAllByUserId(user.getId());
    }

    public VoteAction getCommentVoteByUsername(Long commentId, String username) {
        userService.verifyUserExists(username);

        return commentVoteRepository.findByUser_UsernameAndComment_Id(username, commentId)
            .map(commentVote -> commentVote.isUpvote() ? VoteAction.UPVOTE : VoteAction.DOWNVOTE)
            .orElse(VoteAction.NONE);
    }

    public void applyCommentVote(Long id, @Valid VoteRequest request, String username) {
        var user = userService.getEntityByUsername(username);
        // TODO
    }

    public void deleteAllCommentVotesByUsername(String username) {
        var user = userService.getEntityByUsername(username);
        // TODO
    }
}
