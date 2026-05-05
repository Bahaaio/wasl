package com.github.bahaaio.wasl.community.service;

import com.github.bahaaio.wasl.auth.exception.ForbiddenException;
import com.github.bahaaio.wasl.community.dto.response.CommunityMembershipDto;
import com.github.bahaaio.wasl.community.exception.CommunityMembershipNotFoundException;
import com.github.bahaaio.wasl.community.exception.CommunityNotFoundException;
import com.github.bahaaio.wasl.community.mapper.CommunityMembershipMapper;
import com.github.bahaaio.wasl.community.model.Community;
import com.github.bahaaio.wasl.community.model.CommunityMembership;
import com.github.bahaaio.wasl.community.model.CommunityRole;
import com.github.bahaaio.wasl.community.repository.CommunityMembershipRepository;
import com.github.bahaaio.wasl.community.repository.CommunityRepository;
import com.github.bahaaio.wasl.user.model.User;
import com.github.bahaaio.wasl.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service handling business logic for Community Memberships.
 * Responsible for managing users joining, leaving, and being removed from communities,
 * as well as role verifications.
 */
@Service
@RequiredArgsConstructor
public class CommunityMembershipService {

    private final CommunityMembershipRepository membershipRepository;
    private final CommunityMembershipMapper membershipMapper;
    private final UserService userService;
    private final CommunityRepository communityRepository;
    private final CommunityManagementService subscriberManagementService;

    /**
     * Retrieves all memberships for a specific community.
     *
     * @param communityId the ID of the community
     * @return a list of community memberships mapped to DTOs
     */
    public List<CommunityMembershipDto> getMembersByCommunityId(Long communityId) {
        return membershipRepository.findByCommunityId(communityId).stream()
                .map(membershipMapper::toDto)
                .toList();
    }

    /**
     * Internal method to assign the OWNER role to a user for a community.
     * Bypasses standard membership checks as it is used during community creation.
     *
     * @param community the community entity
     * @param username the username of the user to become owner
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
     * @param communityId the ID of the community to join
     * @param username the username of the user joining
     * @throws IllegalArgumentException if the user is already a member
     */
    @Transactional
    public void joinCommunity(Long communityId, String username) {
        if (membershipRepository.existsByCommunityIdAndUserUsername(communityId, username)) {
            throw new IllegalArgumentException("User is already a member of this community");
        }

        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new CommunityNotFoundException(communityId));
        User user = userService.getEntityByUsername(username);

        CommunityMembership membership = CommunityMembership.builder()
                .community(community)
                .user(user)
                .role(CommunityRole.MEMBER)
                .build();

        membershipRepository.save(membership);
        subscriberManagementService.incrementSubscribers(communityId);
    }

    /**
     * Allows a user to voluntarily leave a community.
     * Decrements the community's subscriber count upon success.
     *
     * @param communityId the ID of the community to leave
     * @param username the username of the user leaving
     * @throws IllegalArgumentException if the user is not a member or is the OWNER
     */
    @Transactional
    public void leaveCommunity(Long communityId, String username) {
        CommunityMembership membership = membershipRepository.findByCommunityIdAndUserUsername(communityId, username)
                .orElseThrow(() -> new IllegalArgumentException("User is not a member of this community"));

        if (membership.getRole() == CommunityRole.OWNER) {
            throw new IllegalArgumentException("Owner cannot leave the community. Transfer ownership or delete community.");
        }

        membershipRepository.delete(membership);
        subscriberManagementService.decrementSubscribers(communityId);
    }

    /**
     * Forcefully removes a member from a community.
     * Only users with OWNER or MODERATOR roles can remove other members.
     *
     * @param communityId the ID of the community
     * @param membershipId the ID of the membership to remove
     * @param requestingUsername the username of the user attempting the removal
     * @throws ForbiddenException if the requester lacks permission
     * @throws IllegalArgumentException if attempting to remove the OWNER
     */
    @Transactional
    public void removeMember(Long communityId, Long membershipId, String requestingUsername) {
        if (!isOwnerOrModerator(communityId, requestingUsername)) {
            throw new ForbiddenException();
        }

        CommunityMembership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new CommunityMembershipNotFoundException(membershipId));

        if (membership.getRole() == CommunityRole.OWNER) {
            throw new IllegalArgumentException("Cannot remove the owner of the community");
        }

        membershipRepository.delete(membership);
        subscriberManagementService.decrementSubscribers(communityId);
    }

    /**
     * Checks if a user has either OWNER or MODERATOR privileges in a community.
     *
     * @param communityId the ID of the community
     * @param username the username of the user
     * @return true if the user is an owner or moderator, false otherwise
     */
    public boolean isOwnerOrModerator(Long communityId, String username) {
        return membershipRepository.existsByCommunityIdAndUserUsernameAndRoleIn(
                communityId, username, List.of(CommunityRole.OWNER, CommunityRole.MODERATOR)
        );
    }

    /**
     * Checks if a user has the OWNER privilege in a community.
     *
     * @param communityId the ID of the community
     * @param username the username of the user
     * @return true if the user is the owner, false otherwise
     */
    public boolean isOwner(Long communityId, String username) {
        return membershipRepository.existsByCommunityIdAndUserUsernameAndRoleIn(
                communityId, username, List.of(CommunityRole.OWNER)
        );
    }

    /**
     * Internal method to delete all memberships associated with a community.
     * Typically used when a community is being deleted.
     *
     * @param communityId the ID of the community
     */
    @Transactional
    public void deleteAllByCommunityId(Long communityId) {
        membershipRepository.deleteAllByCommunityId(communityId);
    }

}
