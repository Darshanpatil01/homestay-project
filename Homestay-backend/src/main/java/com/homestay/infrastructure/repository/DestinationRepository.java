package com.homestay.infrastructure.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homestay.domain.entity.Destination;

public interface DestinationRepository
        extends JpaRepository<Destination, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(
            String name,
            Long id
    );

    List<Destination> findByActiveTrueOrderByDisplayOrderAsc();

    List<Destination> findAllByOrderByDisplayOrderAsc();

    List<Destination>
            findByNameContainingIgnoreCaseOrStateContainingIgnoreCase(
                    String name,
                    String state
            );
}