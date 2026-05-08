package com.github.bahaaio.wasl.post.mapper;

import com.github.bahaaio.wasl.media.dto.MediaDto;
import com.github.bahaaio.wasl.post.dto.PostDto;
import com.github.bahaaio.wasl.post.model.Post;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PostMapper {
    public PostDto toDto(Post post, List<MediaDto> media) {
        var author = post.getAuthor();
        var community = post.getCommunity();

        return PostDto.builder()
            .id(post.getId())
            .title(post.getTitle())
            .content(post.getContent())

            .authorUsername(author.getUsername())
            .authorAvatarMediaId(author.getAvatarMediaId())

            .communityId(community.getId())
            .communityName(community.getName())

            .media(media)

            .userVote(0) // TODO: fetch user vote
            .score(post.getScore())
            .commentCount(post.getCommentCount())
            .createdAt(post.getCreatedAt())
            .build();
    }
}