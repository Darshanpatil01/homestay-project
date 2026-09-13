package com.homestay.application.mapper;

import com.homestay.application.dto.request.CategoryRequest;
import com.homestay.application.dto.response.CategoryResponse;
import com.homestay.domain.entity.Category;

public final class CategoryMapper {

    private CategoryMapper() {
    }

    public static Category toEntity(
            CategoryRequest request
    ) {
        Category category = new Category();

        updateEntity(category, request);

        return category;
    }

    public static void updateEntity(
            Category category,
            CategoryRequest request
    ) {
        category.setName(request.getName().trim());
        category.setDescription(
                request.getDescription().trim()
        );
        category.setImage(request.getImage());

        category.setDisplayOrder(
                request.getDisplayOrder() != null
                        ? request.getDisplayOrder()
                        : 0
        );

        category.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );
    }

    public static CategoryResponse toResponse(
            Category category
    ) {
        CategoryResponse response = new CategoryResponse();

        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setImage(category.getImage());
        response.setDisplayOrder(category.getDisplayOrder());
        response.setActive(category.getActive());
        response.setCreatedAt(category.getCreatedAt());
        response.setUpdatedAt(category.getUpdatedAt());

        return response;
    }
}