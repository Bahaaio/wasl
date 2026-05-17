package com.github.bahaaio.wasl.community.service;

import com.github.bahaaio.wasl.auth.exception.ForbiddenException;
import com.github.bahaaio.wasl.community.dto.response.CommunityMembershipDto;
import com.github.bahaaio.wasl.community.exception.CommunityNotFoundException;
import com.github.bahaaio.wasl.community.mapper.CommunityMembershipMapper;
import com.github.bahaaio.wasl.community.model.Community;
import com.github.bahaaio.wasl.community.model.CommunityMembership;
import com.github.bahaaio.wasl.community.model.CommunityRole;
import com.github.bahaaio.wasl.community.repository.CommunityMembershipRepository;
import com.github.bahaaio.wasl.community.repository.CommunityRepository;
import com.github.bahaaio.wasl.user.model.User;
import com.github.bahaaio.wasl.user.service.UserService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.Set;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * Service handling business logic for Community Memberships.
 * Responsible for managing users joining, leaving, and being removed from communities,
 * as well as role verifications.
 */
@RequiredArgsConstructor
@Service
public class CommunityMembershipService {

    private final CommunityMembershipRepository membershipRepository;
    private final CommunityMembershipMapper membershipMapper;
    private final UserService userService;
    private final CommunityRepository communityRepository;

    /**
     * Retrieves all memberships for a specific community.
     *
     * @param communityName the name of the community
     * @return a list of community memberships mapped to DTOs
     */
    public PagedModel<CommunityMembershipDto> getMembersByCommunityName(String communityName, Pageable pageable) {
        Page<CommunityMembershipDto> membershipDtoList =
            membershipRepository.findAllByCommunity_Name(communityName, pageable)
                .map(membershipMapper::toDto);

        return new PagedModel<>(membershipDtoList);
    }

    /**
     * Internal method to assign the OWNER role to a user for a community.
     * Bypasses standard membership checks as it is used during community creation.
     *
     * @param community the community entity
     * @param username  the username of the user to become owner
     */
    @Transactional
    public void addOwner(Community community, String username) {
        User user = userService.getEntityByUsername(username);

        CommunityMembership membership = CommunityMembership.builder()
            .community(community)
            .user(user)
            .role(CommunityRole.OWNER)
            .build();

        membershipRepository.save(membership);
    }

    /**
     * Allows a user to join a community as a standard MEMBER.
     * Increments the community's subscriber count upon success.
     *
     * @param communityName the name of the community to join
     * @param username      the username of the user joining
     * @throws IllegalArgumentException if the user is already a member
     */
    @Transactional
    public void joinCommunity(String communityName, String username) {
        if (membershipRepository.existsByCommunity_NameAndUser_Username(communityName, username)) {
            throw new IllegalArgumentException("User is already a member of this community");
        }

        User user = userService.getEntityByUsername(username);

        Community community = communityRepository.findByName(communityName)
            .orElseThrow(() -> new CommunityNotFoundException(communityName));

        membershipRepository.save(
            CommunityMembership.builder()
                .community(community)
                .user(user)
                .role(CommunityRole.MEMBER)
                .build()
        );

        communityRepository.incrementSubscribers(communityName);
    }

    /**
     * Allows a user to voluntarily leave a community.
     * Decrements the community's subscriber count upon success.
     *
     * @param communityName the name of the community to leave
     * @param username      the username of the user leaving
     * @throws IllegalArgumentException if the user is not a member or is the OWNER
     */
    @Transactional
    public void leaveCommunity(String communityName, String username) {
        if (isOwner(communityName, username)) {
            throw new IllegalArgumentException("Owner cannot leave the community. Transfer ownership or delete community.");
        }

        if (membershipRepository.deleteByCommunity_NameAndUser_Username(communityName, username) != 0) {
            // decrement subs only if user was removed
            communityRepository.decrementSubscribers(communityName);
        }
    }

    /**
     * Forcefully removes a member from a community.
     * Only users with OWNER or MODERATOR roles can remove other members.
     *
     * @param communityName      the name of the community
     * @param username           the username of the user to remove
     * @param requestingUsername the username of the user attempting the removal
     * @throws ForbiddenException       if the requester lacks permission
     * @throws IllegalArgumentException if attempting to remove the OWNER
     */
    @Transactional
    public void removeMember(String communityName, String username, String requestingUsername) {
        if (!isOwnerOrModerator(communityName, requestingUsername)) {
            throw new ForbiddenException();
        }

        if (isOwner(communityName, username)) {
            throw new IllegalArgumentException("Cannot remove the owner of the community");
        }

        if (membershipRepository.deleteByCommunity_NameAndUser_Username(communityName, username) != 0) {
            communityRepository.decrementSubscribers(communityName);
        }
    }

    /**
     * Checks if a user has either OWNER or MODERATOR privileges in a community.
     *
     * @param communityName the name of the community
     * @param username      the username of the user
     * @return true if the user is an owner or moderator, false otherwise
     */
    public boolean isOwnerOrModerator(String communityName, String username) {
        return membershipRepository.existsByCommunity_NameAndUser_UsernameAndRoleIn(
            communityName, username, Set.of(CommunityRole.OWNER, CommunityRole.MODERATOR)
        );
    }

    /**
     * Checks if a user has the OWNER privilege in a community.
     *
     * @param communityName the name of the community
     * @param username      the username of the user
     * @return true if the user is the owner, false otherwise
     */
    public boolean isOwner(String communityName, String username) {
        return membershipRepository.existsByCommunity_NameAndUser_UsernameAndRoleIn(
            communityName, username, Set.of(CommunityRole.OWNER)
        );
    }

    /**
     * Internal method to delete all memberships associated with a community.
     * Typically used when a community is being deleted.
     *
     * @param name the name of the community
     */
    @Transactional
    public void deleteAllByCommunityName(String name) {
        membershipRepository.deleteAllByCommunity_Name(name);
    }
}
