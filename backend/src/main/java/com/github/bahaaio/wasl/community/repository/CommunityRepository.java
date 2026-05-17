package com.github.bahaaio.wasl.community.repository;

import com.github.bahaaio.wasl.community.model.Community;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CommunityRepository extends JpaRepository<Community, Long> {

    Optional<Community> findByName(String name);

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

    void deleteByName(String name);
}
