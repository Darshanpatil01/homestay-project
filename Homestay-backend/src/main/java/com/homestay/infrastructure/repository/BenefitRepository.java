package com.homestay.infrastructure.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homestay.domain.entity.Benefit;

public interface BenefitRepository
        extends JpaRepository<Benefit, Long> {

    boolean existsByTitleIgnoreCase(String title);

    boolean existsByTitleIgnoreCaseAndIdNot(
            String title,
            Long id
    );

    List<Benefit> findByActiveTrueOrderByDisplayOrderAsc();

    List<Benefit> findAllByOrderByDisplayOrderAsc();
}