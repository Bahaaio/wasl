package com.github.bahaaio.wasl.community.repository;

import com.github.bahaaio.wasl.community.model.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository<Community,Long> {
    boolean existsByNameIgnoreCase(String name);
    Optional<Community> findByNameIgnoreCase(String name);
}
