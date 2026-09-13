package com.homestay.application.serviceimpl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homestay.application.dto.request.ChangePasswordRequest;
import com.homestay.application.dto.request.UpdateProfileRequest;
import com.homestay.application.dto.request.UpdateUserStatusRequest;
import com.homestay.application.dto.response.UserResponse;
import com.homestay.application.mapper.UserMapper;
import com.homestay.application.service.IUserService;
import com.homestay.domain.entity.User;
import com.homestay.infrastructure.repository.UserRepository;

@Service
@Transactional
public class UserServiceImpl
        implements IUserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(
            Long userId
    ) {

        User user = findUserById(userId);

        return UserMapper.toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    @Override
    public UserResponse updateProfile(
            Long userId,
            UpdateProfileRequest request
    ) {

        User user = findUserById(userId);

        String requestedEmail =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        String requestedPhone =
                request.getPhone().trim();

        userRepository
                .findByEmailIgnoreCase(
                        requestedEmail
                )
                .filter(existingUser ->
                        !existingUser.getId()
                                .equals(userId)
                )
                .ifPresent(existingUser -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Email address is already registered"
                    );
                });

        userRepository
                .findByPhone(requestedPhone)
                .filter(existingUser ->
                        !existingUser.getId()
                                .equals(userId)
                )
                .ifPresent(existingUser -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Phone number is already registered"
                    );
                });

        UserMapper.updateEntity(user, request);

        User savedUser =
                userRepository.save(user);

        return UserMapper.toResponse(savedUser);
    }

    @Override
    public void changePassword(
            Long userId,
            ChangePasswordRequest request
    ) {

        User user = findUserById(userId);

        boolean currentPasswordMatches =
                passwordEncoder.matches(
                        request.getCurrentPassword(),
                        user.getPassword()
                );

        if (!currentPasswordMatches) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Current password is incorrect"
            );
        }

        if (!request.getNewPassword().equals(
                request.getConfirmPassword()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password and confirm password do not match"
            );
        }

        boolean sameAsCurrentPassword =
                passwordEncoder.matches(
                        request.getNewPassword(),
                        user.getPassword()
                );

        if (sameAsCurrentPassword) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password must be different from current password"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
    }

    @Override
    public UserResponse updateUserStatus(
            Long userId,
            UpdateUserStatusRequest request
    ) {

        User user = findUserById(userId);

        user.setStatus(request.getStatus());

        User updatedUser =
                userRepository.save(user);

        return UserMapper.toResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long userId) {

        User user = findUserById(userId);

        userRepository.delete(user);
    }

    private User findUserById(Long userId) {

        return userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found with ID: "
                                        + userId
                        )
                );
    }
}