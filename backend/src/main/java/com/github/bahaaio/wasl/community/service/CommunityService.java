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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final CommunityMapper communityMapper;
    private final CommunityCategoryService categoryService;
    private final CommunityMembershipService membershipService;

    /**
     * Retrieves all communities available in the system.
     *
     * @return a list of all communities mapped to DTOs
     */
    public List<CommunityDto> getAllCommunities() {
        return communityRepository.findAll().stream()
                .map(communityMapper::toDto)
                .toList();
    }

    /**
     * Retrieves a specific community by its ID and returns it as a DTO.
     *
     * @param id the ID of the community
     * @return the mapped CommunityDto
     * @throws CommunityNotFoundException if the community does not exist
     */
    public CommunityDto getById(Long id) {
        Community community = getEntityById(id);
        return communityMapper.toDto(community);
    }

    /**
     * Retrieves the raw Community entity by its ID for internal module usage.
     *
     * @param id the ID of the community
     * @return the Community entity
     * @throws CommunityNotFoundException if the community does not exist
     */
    public Community getEntityById(Long id) {
        return communityRepository.findById(id)
                .orElseThrow(() -> new CommunityNotFoundException(id));
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
                .subscribersCount(0L)
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
     * @param id the ID of the community to update
     * @param request the updated community details
     * @param username the username of the user requesting the update
     * @return the updated CommunityDto
     * @throws ForbiddenException if the user does not have sufficient permissions
     */
    @Transactional
    public CommunityDto updateCommunity(Long id, CommunityPatchRequest request, String username) {
        Community community = getEntityById(id);

        // Check if user is owner/moderator
        if (!membershipService.isOwnerOrModerator(id, username)) {
            throw new ForbiddenException();
        }

        CommunityCategory category = categoryService.getEntityById(request.categoryId());

        community.setDescription(request.description());
        community.setCategory(category);
        community.setPublic(request.isPublic());

        return communityMapper.toDto(communityRepository.save(community));
    }

    /**
     * Deletes a community and all its associated memberships.
     * Only the OWNER can perform this action.
     *
     * @param id the ID of the community to delete
     * @param username the username of the user requesting the deletion
     * @throws ForbiddenException if the user is not the owner
     */
    @Transactional
    public void deleteCommunity(Long id, String username) {
        Community community = getEntityById(id);

        if (!membershipService.isOwner(id, username)) {
            throw new ForbiddenException();
        }

        membershipService.deleteAllByCommunityId(id);
        communityRepository.delete(community);
    }
}
