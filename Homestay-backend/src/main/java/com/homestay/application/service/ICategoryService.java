package com.homestay.application.service;

import java.util.List;

import com.homestay.application.dto.request.CategoryRequest;
import com.homestay.application.dto.response.CategoryResponse;

public interface ICategoryService {

    List<CategoryResponse> getPublicCategories();

    CategoryResponse getPublicCategoryById(Long id);

    List<CategoryResponse> getAllCategoriesForClient();

    CategoryResponse getCategoryByIdForClient(Long id);

    CategoryResponse createCategory(
            CategoryRequest request
    );

    CategoryResponse updateCategory(
            Long id,
            CategoryRequest request
    );

    void deleteCategory(Long id);
}