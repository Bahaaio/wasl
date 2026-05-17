package com.github.bahaaio.wasl.community.service;

import com.github.bahaaio.wasl.community.dto.response.CommunityCategoryDto;
import com.github.bahaaio.wasl.community.exception.CommunityCategoryNotFoundException;
import com.github.bahaaio.wasl.community.mapper.CommunityCategoryMapper;
import com.github.bahaaio.wasl.community.model.CommunityCategory;
import com.github.bahaaio.wasl.community.repository.CommunityCategoryRepository;

import org.springframework.stereotype.Service;

import java.util.List;

import lombok.RequiredArgsConstructor;

/**
 * Service responsible for managing community categories.
 * Provides operations to retrieve and create categories.
 */
@RequiredArgsConstructor
@Service
public class CommunityCategoryService {
    private final CommunityCategoryRepository categoryRepository;
    private final CommunityCategoryMapper categoryMapper;

    /**
     * Retrieves a list of all community categories.
     *
     * @return a list of CommunityCategoryDto representing all available categories
     */
    public List<CommunityCategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    /**
     * Retrieves a community category entity by its ID.
     *
     * @param id the ID of the category to retrieve
     * @return the CommunityCategory entity
     * @throws CommunityCategoryNotFoundException if no category with the given ID exists
     */
    public CommunityCategory getEntityById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CommunityCategoryNotFoundException(id));
    }
}


