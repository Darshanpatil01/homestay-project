package com.homestay.infrastructure.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homestay.domain.entity.Booking;
import com.homestay.domain.enums.BookingStatus;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );

    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findByStatusOrderByCreatedAtDesc(
            BookingStatus status
    );

    boolean existsByBookingNumber(String bookingNumber);
}