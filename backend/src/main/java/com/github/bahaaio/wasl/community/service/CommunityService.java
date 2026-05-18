package com.github.bahaaio.wasl.community.service;

import com.github.bahaaio.wasl.auth.exception.ForbiddenException;
import com.github.bahaaio.wasl.community.dto.request.CommunityCreateRequest;
import com.github.bahaaio.wasl.community.dto.request.CommunityPatchRequest;
import com.github.bahaaio.wasl.community.dto.response.CommunityDto;
import com.github.bahaaio.wasl.community.exception.CommunityNotFoundException;
import com.github.bahaaio.wasl.community.mapper.CommunityMapper;
import com.github.bahaaio.wasl.community.model.Community;
import com.github.bahaaio.wasl.community.model.CommunityCategory;
import com.github.bahaaio.wasl.community.repository.CommunityRepository;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CommunityService {
    private final CommunityRepository communityRepository;
    private final CommunityMapper communityMapper;
    private final CommunityCategoryService categoryService;
    private final CommunityMembershipService membershipService;

    public PagedModel<CommunityDto> search(String query, Pageable pageable) {
        var communities = communityRepository.findAllByNameContainingIgnoreCase(query, pageable)
            .map(communityMapper::toDto);

        return new PagedModel<>(communities);
    }

    /**
     * Retrieves a specific community by its ID and returns it as a DTO.
     *
     * @param name the name of the community
     * @return the mapped CommunityDto
     * @throws CommunityNotFoundException if the community does not exist
     */
    public CommunityDto getByName(String name) {
        Community community = getEntityByName(name);
        return communityMapper.toDto(community);
    }

    /**
     * Retrieves the raw Community entity by its name for internal module usage.
     *
     * @param name the name of the community
     * @return the Community entity
     * @throws CommunityNotFoundException if the community does not exist
     */
    public Community getEntityByName(String name) {
        return communityRepository.findByName(name)
            .orElseThrow(() -> new CommunityNotFoundException(name));
    }

    public PagedModel<CommunityDto> listUserSubbed(String username, Pageable pageable) {
        var communities = communityRepository.listUserSubbedCommunities(username, pageable)
            .map(communityMapper::toDto);

        return new PagedModel<>(communities);
    }

    /**
     * Creates a new community and assigns the creator as the OWNER.
     *
     * @param request  the community creation details
     * @param username the username of the user creating the community
     * @return the created CommunityDto
     * @throws IllegalArgumentException if a community with the same name exists
     */
    @Transactional
    public CommunityDto createCommunity(CommunityCreateRequest request, String username) {
        if (communityRepository.existsByNameIgnoreCase(request.name())) {
            throw new IllegalArgumentException("Community with this name already exists");
        }

        CommunityCategory category = categoryService.getEntityById(request.categoryId());

        Community community = Community.builder()
            .name(request.name())
            .description(request.description())
            .category(category)
            .isPublic(request.isPublic())
            .build();

        Community saved = communityRepository.save(community);

        // Add creator as owner
        membershipService.addOwner(saved, username);

        return communityMapper.toDto(communityRepository.findById(saved.getId()).orElse(saved));
    }

    /**
     * Updates an existing community's details.
     * Only users with OWNER or MODERATOR roles can perform this action.
     *
     * @param communityName the name of the community to update
     * @param request       the updated community details
     * @param username      the username of the user requesting the update
     * @return the updated CommunityDto
     * @throws ForbiddenException if the user does not have sufficient permissions
     */
    @Transactional
    public CommunityDto updateCommunity(String communityName, CommunityPatchRequest request, String username) {
        Community community = getEntityByName(communityName);

        // Check if user is owner/moderator
        if (!membershipService.isOwnerOrModerator(communityName, username)) {
            throw new ForbiddenException();
        }

        CommunityCategory category = categoryService.getEntityById(request.categoryId());

        if (StringUtils.isNotBlank(request.description())) community.setDescription(request.description());
        if (request.categoryId() != null) community.setCategory(category);
        if (request.isPublic() != null) community.setPublic(request.isPublic());

        return communityMapper.toDto(communityRepository.save(community));
    }
}
