package com.homestay.infrastructure.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homestay.domain.entity.Testimonial;

public interface TestimonialRepository
        extends JpaRepository<Testimonial, Long> {

    List<Testimonial> findByActiveTrueOrderByDisplayOrderAsc();

    List<Testimonial> findAllByOrderByDisplayOrderAsc();

    List<Testimonial> findByGuestNameContainingIgnoreCase(
            String guestName
    );
}