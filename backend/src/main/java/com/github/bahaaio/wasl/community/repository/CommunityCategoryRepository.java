package com.github.bahaaio.wasl.community.repository;

import com.github.bahaaio.wasl.community.model.CommunityCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityCategoryRepository extends JpaRepository<CommunityCategory,Long> {
    boolean existsByNameIgnoreCase(String name);
}
