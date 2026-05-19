package com.github.bahaaio.wasl.community.repository;

import com.github.bahaaio.wasl.community.model.Community;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

import jakarta.transaction.Transactional;

public interface CommunityRepository extends JpaRepository<Community, Long> {

    Optional<Community> findByName(String name);

    @Query("""
            SELECT c FROM Community c
            JOIN CommunityMembership cm ON c.id = cm.community.id
            WHERE cm.user.username = :username
        """)
    Page<Community> listUserSubbedCommunities(String username, Pageable pageable);

    Page<Community> findAllByNameContainingIgnoreCase(String name, Pageable pageable);

    boolean existsByNameIgnoreCase(String name);

    /**
     * Atomically increments the subscriber count for a community.
     *
     * @param communityName the name of the community
     */
    @Modifying
    @Query("UPDATE Community c SET c.subscribersCount = c.subscribersCount + 1 WHERE c.name = :communityName")
    void incrementSubscribers(String communityName);

    /**
     * Atomically decrements the subscriber count by 1 for all communities that the specified user is a member of.
     *
     * @param userId the unique identifier of the user
     */
    @Transactional
    @Modifying
    @Query("""
        UPDATE Community c
        SET c.subscribersCount = CASE WHEN c.subscribersCount > 0 THEN c.subscribersCount - 1 ELSE 0 END
        WHERE c.id IN (
            SELECT cm.community.id
            From CommunityMembership cm
            WHERE cm.user.id = :userId
        )
        """)
    void decrementSubscribersForUserMemberships(Long userId);

    /**
     * Atomically decrements the subscriber count for a community, ensuring it never goes below 0.
     *
     * @param communityName the name of the community
     */
    @Modifying
    @Query("""
            UPDATE Community c
            SET c.subscribersCount = CASE WHEN c.subscribersCount > 0 THEN c.subscribersCount - 1 ELSE 0 END
            WHERE c.name = :communityName
        """)
    void decrementSubscribers(String communityName);
}
