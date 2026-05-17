package com.github.bahaaio.wasl.community.repository;

import com.github.bahaaio.wasl.community.model.CommunityMembership;
import com.github.bahaaio.wasl.community.model.CommunityRole;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityMembershipRepository extends JpaRepository<CommunityMembership, Long> {
    Optional<CommunityMembership> findByCommunityIdAndUserUsername(Long communityId, String username);

    List<CommunityMembership> findByCommunityId(Long communityId);

    boolean existsByCommunityIdAndUserUsername(Long communityId, String username);

    boolean existsByCommunityIdAndUserUsernameAndRoleIn(Long communityId, String username, List<CommunityRole> roles);

    void deleteAllByCommunityId(Long communityId);
}
