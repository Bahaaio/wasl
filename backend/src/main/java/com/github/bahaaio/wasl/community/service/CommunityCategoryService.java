package com.github.bahaaio.wasl.community.service;

import com.github.bahaaio.wasl.community.dto.request.CommunityCategoryCreateRequest;
import com.github.bahaaio.wasl.community.dto.response.CommunityCategoryDto;
import com.github.bahaaio.wasl.community.exception.CommunityCategoryNotFoundException;
import com.github.bahaaio.wasl.community.mapper.CommunityCategoryMapper;
import com.github.bahaaio.wasl.community.model.CommunityCategory;
import com.github.bahaaio.wasl.community.model.CommunityRole;
import com.github.bahaaio.wasl.community.repository.CommunityCategoryRepository;
import com.github.bahaaio.wasl.community.repository.CommunityMembershipRepository;
import jakarta.transaction.Transactional;
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
    private final CommunityMembershipRepository membershipRepository;

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

    /**
     * Creates a new community category.
     *
     * @param request the category creation request containing the category name
     * @param username the username of the user requesting the creation
     * @return the created CommunityCategoryDto
     * @throws IllegalArgumentException if a category with the same name already exists
     */
    @Transactional
    public CommunityCategoryDto createCategory(CommunityCategoryCreateRequest request, String username) {
        // Validate that user has MODERATOR or OWNER role in any community (admin-level permission)
        if (!membershipRepository.existsByUserUsernameAndRoleIn(username,
                List.of(CommunityRole.MODERATOR, CommunityRole.OWNER))) {
            throw new IllegalArgumentException("User must be a moderator or owner in at community to create categories");
        }

        if (categoryRepository.existsByNameIgnoreCase(request.name())) {
            throw new IllegalArgumentException("Category with this name already exists");
        }

        CommunityCategory category = new CommunityCategory();
        category.setName(request.name());

        CommunityCategory saved = categoryRepository.save(category);
        return categoryMapper.toDto(saved);
    }
}
