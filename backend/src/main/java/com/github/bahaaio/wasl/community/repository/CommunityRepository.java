package com.github.bahaaio.wasl.community.repository;

import com.github.bahaaio.wasl.community.model.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository<Community,Long> {
    boolean existsByNameIgnoreCase(String name);
    Optional<Community> findByNameIgnoreCase(String name);

    /**
     * Atomically increments the subscriber count for a community.
     * @param communityId the ID of the community
     * @return the number of rows affected (1 if successful, 0 if community not found)
     */
    @Modifying
    @Query("UPDATE Community c SET c.subscribersCount = c.subscribersCount + 1 WHERE c.id = :communityId")
    int incrementSubscribers(Long communityId);

    /**
     * Atomically decrements the subscriber count for a community, ensuring it never goes below 0.
     * @param communityId the ID of the community
     * @return the number of rows affected (1 if successful, 0 if community not found)
     */
    @Modifying
    @Query("UPDATE Community c SET c.subscribersCount = CASE WHEN c.subscribersCount > 0 THEN c.subscribersCount - 1 ELSE 0 END WHERE c.id = :communityId")
    int decrementSubscribers(Long communityId);
}
