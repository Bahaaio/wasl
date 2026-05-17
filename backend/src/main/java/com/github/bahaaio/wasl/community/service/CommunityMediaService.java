package com.github.bahaaio.wasl.community.service;

import com.github.bahaaio.wasl.auth.exception.ForbiddenException;
import com.github.bahaaio.wasl.community.dto.response.CommunityMediaUpdateResponse;
import com.github.bahaaio.wasl.media.model.MediaOwnerType;
import com.github.bahaaio.wasl.media.service.MediaService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CommunityMediaService {
    private final MediaService mediaService;
    private final CommunityService communityService;
    private final CommunityMembershipService membershipService;

    @Transactional
    public CommunityMediaUpdateResponse updateIcon(String communityName, MultipartFile file, String username) {
        if (!membershipService.isOwnerOrModerator(communityName, username)) {
            throw new ForbiddenException();
        }

        var community = communityService.getEntityByName(communityName);
        UUID oldIconMediaId = community.getIconMediaId();

        var response = mediaService.uploadMedia(file, username);
        var mediaDto = mediaService.attachMedia(response.id(), MediaOwnerType.COMMUNITY, community.getId(), username);
        community.setIconMediaId(response.id());

        if (oldIconMediaId != null) {
            mediaService.deleteMediaById(oldIconMediaId);
        }

        return new CommunityMediaUpdateResponse(mediaDto.id());
    }

    @Transactional
    public void deleteIcon(String communityName, String username) {
        if (!membershipService.isOwnerOrModerator(communityName, username)) {
            throw new ForbiddenException();
        }

        var community = communityService.getEntityByName(communityName);

        if (community.getIconMediaId() != null) {
            mediaService.deleteMediaById(community.getIconMediaId());
            community.setIconMediaId(null);
        }
    }

    @Transactional
    public CommunityMediaUpdateResponse updateBanner(String communityName, MultipartFile file, String username) {
        if (!membershipService.isOwnerOrModerator(communityName, username)) {
            throw new ForbiddenException();
        }

        var community = communityService.getEntityByName(communityName);
        UUID oldBannerMediaId = community.getBannerMediaId();

        var response = mediaService.uploadMedia(file, username);
        var mediaDto = mediaService.attachMedia(response.id(), MediaOwnerType.COMMUNITY, community.getId(), username);
        community.setBannerMediaId(response.id());

        if (oldBannerMediaId != null) {
            mediaService.deleteMediaById(oldBannerMediaId);
        }

        return new CommunityMediaUpdateResponse(mediaDto.id());
    }

    @Transactional
    public void deleteBanner(String communityName, String username) {
        if (!membershipService.isOwnerOrModerator(communityName, username)) {
            throw new ForbiddenException();
        }

        var community = communityService.getEntityByName(communityName);

        if (community.getBannerMediaId() != null) {
            mediaService.deleteMediaById(community.getBannerMediaId());
            community.setBannerMediaId(null);
        }
    }
}
