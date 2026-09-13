package com.homestay.application.mapper;

import com.homestay.application.dto.request.UpdateProfileRequest;
import com.homestay.application.dto.response.UserResponse;
import com.homestay.domain.entity.User;

public final class UserMapper {

    private UserMapper() {
    }

    public static UserResponse toResponse(
            User user
    ) {

        if (user == null) {
            return null;
        }

        UserResponse response =
                new UserResponse();

        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setAddress(user.getAddress());
        response.setCity(user.getCity());
        response.setState(user.getState());
        response.setPostalCode(
                user.getPostalCode()
        );
        response.setProfileImage(
                user.getProfileImage()
        );
        response.setRole(user.getRole());
        response.setStatus(user.getStatus());
        response.setCreatedAt(
                user.getCreatedAt()
        );
        response.setUpdatedAt(
                user.getUpdatedAt()
        );

        return response;
    }

    public static void updateEntity(
            User user,
            UpdateProfileRequest request
    ) {

        user.setFullName(
                request.getFullName().trim()
        );

        user.setEmail(
                request.getEmail()
                        .trim()
                        .toLowerCase()
        );

        user.setPhone(
                request.getPhone().trim()
        );

        user.setAddress(
                normalize(request.getAddress())
        );

        user.setCity(
                normalize(request.getCity())
        );

        user.setState(
                normalize(request.getState())
        );

        user.setPostalCode(
                normalize(request.getPostalCode())
        );

        user.setProfileImage(
                normalize(request.getProfileImage())
        );
    }

    private static String normalize(
            String value
    ) {

        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();

        return normalizedValue.isEmpty()
                ? null
                : normalizedValue;
    }
}