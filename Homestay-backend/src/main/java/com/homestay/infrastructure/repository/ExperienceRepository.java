package com.homestay.infrastructure.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homestay.domain.entity.Experience;

public interface ExperienceRepository
        extends JpaRepository<Experience, Long> {

    boolean existsByTitleIgnoreCase(String title);

    boolean existsByTitleIgnoreCaseAndIdNot(
            String title,
            Long id
    );

    List<Experience> findByActiveTrueOrderByDisplayOrderAsc();

    List<Experience> findAllByOrderByDisplayOrderAsc();

    List<Experience> findByTitleContainingIgnoreCase(
            String title
    );
}