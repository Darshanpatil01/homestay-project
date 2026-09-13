package com.homestay.infrastructure.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.homestay.domain.entity.User;
import com.homestay.domain.enums.UserStatus;
import com.homestay.infrastructure.repository.UserRepository;

@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(
            UserRepository userRepository
    ) {

        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(
            String email
    ) throws UsernameNotFoundException {

        User user = userRepository
                .findByEmailIgnoreCase(
                        email.trim()
                )
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with email: "
                                        + email
                        )
                );

        boolean accountEnabled =
                user.getStatus()
                        == UserStatus.ACTIVE
                || user.getStatus()
                        == UserStatus.APPROVED;

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(
                        "ROLE_" + user.getRole().name()
                )
                .disabled(!accountEnabled)
                .accountExpired(false)
                .accountLocked(
                        user.getStatus()
                                == UserStatus.BLOCKED
                )
                .credentialsExpired(false)
                .build();
    }
}