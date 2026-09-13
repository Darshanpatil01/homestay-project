package com.homestay.presentation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homestay.application.dto.request.CategoryRequest;
import com.homestay.application.dto.response.CategoryResponse;
import com.homestay.application.service.ICategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class CategoryController {

    private final ICategoryService categoryService;

    public CategoryController(
            ICategoryService categoryService
    ) {
        this.categoryService = categoryService;
    }

    // Public endpoints

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>>
            getPublicCategories() {

        return ResponseEntity.ok(
                categoryService.getPublicCategories()
        );
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<CategoryResponse>
            getPublicCategoryById(
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                categoryService.getPublicCategoryById(id)
        );
    }

    // Client and Admin endpoints

    @GetMapping("/client/categories")
    public ResponseEntity<List<CategoryResponse>>
            getAllCategoriesForClient() {

        return ResponseEntity.ok(
                categoryService.getAllCategoriesForClient()
        );
    }

    @GetMapping("/client/categories/{id}")
    public ResponseEntity<CategoryResponse>
            getCategoryByIdForClient(
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                categoryService.getCategoryByIdForClient(id)
        );
    }

    @PostMapping("/client/categories")
    public ResponseEntity<CategoryResponse>
            createCategory(
                    @Valid
                    @RequestBody CategoryRequest request
            ) {

        CategoryResponse createdCategory =
                categoryService.createCategory(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdCategory);
    }

    @PutMapping("/client/categories/{id}")
    public ResponseEntity<CategoryResponse>
            updateCategory(
                    @PathVariable Long id,
                    @Valid
                    @RequestBody CategoryRequest request
            ) {

        CategoryResponse updatedCategory =
                categoryService.updateCategory(
                        id,
                        request
                );

        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/client/categories/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id
    ) {
        categoryService.deleteCategory(id);

        return ResponseEntity.noContent().build();
    }
} 