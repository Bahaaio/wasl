package com.github.bahaaio.wasl.community.service;

import com.github.bahaaio.wasl.community.exception.CommunityNotFoundException;
import com.github.bahaaio.wasl.community.model.Community;
import com.github.bahaaio.wasl.community.repository.CommunityRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Service for managing community subscriber counts.
 * This service is designed to be used by other services without creating circular dependencies.
 * It handles the atomic operations of incrementing and decrementing subscriber counts.
 */
@Service
@RequiredArgsConstructor
public class CommunityManagementService {

    private final CommunityRepository communityRepository;

    /**
     * Safely increments the subscriber count for a community.
     * Called internally when a user joins the community.
     *
     * @param communityId the ID of the community
     * @throws CommunityNotFoundException if the community does not exist
     */
    @Transactional
    public void incrementSubscribers(Long communityId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new CommunityNotFoundException(communityId));
        community.setSubscribersCount(community.getSubscribersCount() + 1);
        communityRepository.save(community);
    }

    /**
     * Safely decrements the subscriber count for a community.
     * Called internally when a user leaves or is removed from the community.
     * Ensures the count never drops below 0.
     *
     * @param communityId the ID of the community
     * @throws CommunityNotFoundException if the community does not exist
     */
    @Transactional
    public void decrementSubscribers(Long communityId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new CommunityNotFoundException(communityId));
        long count = community.getSubscribersCount() - 1;
        community.setSubscribersCount(count < 0 ? 0 : count);
        communityRepository.save(community);
    }
}

