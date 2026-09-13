package com.homestay.application.serviceimpl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homestay.application.dto.request.CategoryRequest;
import com.homestay.application.dto.response.CategoryResponse;
import com.homestay.application.mapper.CategoryMapper;
import com.homestay.application.service.ICategoryService;
import com.homestay.domain.entity.Category;
import com.homestay.infrastructure.repository.CategoryRepository;

@Service
@Transactional
public class CategoryServiceImpl
        implements ICategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(
            CategoryRepository categoryRepository
    ) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getPublicCategories() {
        return categoryRepository
                .findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(CategoryMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getPublicCategoryById(Long id) {
        Category category = getCategoryEntity(id);

        if (!Boolean.TRUE.equals(category.getActive())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Category not found."
            );
        }

        return CategoryMapper.toResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse>
            getAllCategoriesForClient() {

        return categoryRepository
                .findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(CategoryMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryByIdForClient(
            Long id
    ) {
        Category category = getCategoryEntity(id);

        return CategoryMapper.toResponse(category);
    }

    @Override
    public CategoryResponse createCategory(
            CategoryRequest request
    ) {
        String categoryName = request.getName().trim();

        if (categoryRepository.existsByNameIgnoreCase(
                categoryName
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A category with this name already exists."
            );
        }

        Category category =
                CategoryMapper.toEntity(request);

        Category savedCategory =
                categoryRepository.save(category);

        return CategoryMapper.toResponse(savedCategory);
    }

    @Override
    public CategoryResponse updateCategory(
            Long id,
            CategoryRequest request
    ) {
        Category category = getCategoryEntity(id);

        String categoryName = request.getName().trim();

        if (categoryRepository
                .existsByNameIgnoreCaseAndIdNot(
                        categoryName,
                        id
                )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A category with this name already exists."
            );
        }

        CategoryMapper.updateEntity(category, request);

        Category updatedCategory =
                categoryRepository.save(category);

        return CategoryMapper.toResponse(updatedCategory);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = getCategoryEntity(id);

        categoryRepository.delete(category);
    }

    private Category getCategoryEntity(Long id) {
        return categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Category not found with ID: " + id
                        )
                );
    }
}