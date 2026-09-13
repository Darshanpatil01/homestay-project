package com.homestay.infrastructure.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homestay.domain.entity.Wishlist;

public interface WishlistRepository
        extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );

    Optional<Wishlist> findByUserIdAndHomestayId(
            Long userId,
            Long homestayId
    );

    boolean existsByUserIdAndHomestayId(
            Long userId,
            Long homestayId
    );

    void deleteByUserIdAndHomestayId(
            Long userId,
            Long homestayId
    );
}