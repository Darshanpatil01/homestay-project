package com.homestay.infrastructure.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homestay.domain.entity.User;
import com.homestay.domain.enums.Role;
import com.homestay.domain.enums.UserStatus;

@Repository
public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(
            String email
    );

    Optional<User> findByPhone(
            String phone
    );

    boolean existsByEmailIgnoreCase(
            String email
    );

    boolean existsByPhone(
            String phone
    );

    List<User> findByRole(
            Role role
    );

    List<User> findByStatus(
            UserStatus status
    );

    List<User> findByRoleAndStatus(
            Role role,
            UserStatus status
    );

    List<User> findByFullNameContainingIgnoreCase(
            String fullName
    );
}