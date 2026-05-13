package com.github.bahaaio.wasl.community.service;

import com.github.bahaaio.wasl.community.dto.response.CommunityCategoryDto;
import com.github.bahaaio.wasl.community.mapper.CommunityCategoryMapper;
import com.github.bahaaio.wasl.community.repository.CommunityCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service responsible for managing community categories.
 * Provides operations to retrieve and create categories.
 */
@Service
@RequiredArgsConstructor
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


}
