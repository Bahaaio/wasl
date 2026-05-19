package com.github.bahaaio.wasl.community.repository;

import com.github.bahaaio.wasl.community.model.Community;
import com.github.bahaaio.wasl.community.model.CommunityMembership;
import com.github.bahaaio.wasl.community.model.CommunityRole;
import com.github.bahaaio.wasl.user.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface CommunityMembershipRepository extends JpaRepository<CommunityMembership, Long> {
    Page<CommunityMembership> findAllByCommunity_Name(String communityName, Pageable pageable);

    boolean existsByCommunity_NameAndUser_Username(String communityName, String userUsername);

    boolean existsByCommunity_NameAndUser_UsernameAndRoleIn(
        String communityName,
        String userUsername,
        Set<CommunityRole> roles
    );

    long deleteByCommunity_NameAndUser_Username(String communityName, String userUsername);

    Optional<CommunityMembership> findFirstByCommunityAndRoleOrderByCreatedAtAsc(Community community, CommunityRole role);

    Optional<CommunityMembership> findByCommunityAndRole(Community community, CommunityRole communityRole);

    CommunityMembership findByCommunityAndUser(Community community, User user);

    List<CommunityMembership> findAllByUserAndRole(User user, CommunityRole role);

    void deleteAllByUserId(Long userId);
}
