package com.github.bahaaio.wasl.post.mapper;

import com.github.bahaaio.wasl.media.dto.MediaDto;
import com.github.bahaaio.wasl.post.dto.PostDto;
import com.github.bahaaio.wasl.post.model.Post;
import com.github.bahaaio.wasl.vote.model.VoteAction;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PostMapper {
    public PostDto toDto(Post post, List<MediaDto> media, VoteAction vote) {
        var author = post.getAuthor();
        var community = post.getCommunity();

        var authorUsername = author.isDeleted() ? "[deleted]" : author.getUsername();

        return PostDto.builder()
            .id(post.getId())
            .title(post.getTitle())
            .content(post.getContent())

            .authorUsername(authorUsername)
            .authorAvatarMediaId(author.getAvatarMediaId())

            .communityIconMediaId(community.getIconMediaId())
            .communityName(community.getName())

            .media(media)

            .vote(vote)
            .score(post.getScore())
            .commentCount(post.getCommentCount())
            .deleted(post.isDeleted())
            .createdAt(post.getCreatedAt())
            .build();
    }
}