package com.homestay.infrastructure.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homestay.domain.entity.Homestay;
import com.homestay.domain.enums.HomestayStatus;

public interface HomestayRepository
        extends JpaRepository<Homestay, Long> {

    List<Homestay> findByStatus(HomestayStatus status);

    List<Homestay> findByFeaturedTrueAndStatus(
            HomestayStatus status
    );

    List<Homestay> findByLocationContainingIgnoreCaseAndStatus(
            String location,
            HomestayStatus status
    );

    List<Homestay> findByCategoryIgnoreCaseAndStatus(
            String category,
            HomestayStatus status
    );

    List<Homestay> findByPricePerNightLessThanEqualAndStatus(
            BigDecimal maximumPrice,
            HomestayStatus status
    );

    List<Homestay> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(
            String name,
            String location
    );
}