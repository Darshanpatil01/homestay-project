package com.homestay.application.service;

import java.util.List;

import com.homestay.application.dto.request.ChangePasswordRequest;
import com.homestay.application.dto.request.UpdateProfileRequest;
import com.homestay.application.dto.request.UpdateUserStatusRequest;
import com.homestay.application.dto.response.UserResponse;

public interface IUserService {

    UserResponse getUserById(Long userId);

    List<UserResponse> getAllUsers();

    UserResponse updateProfile(
            Long userId,
            UpdateProfileRequest request
    );

    void changePassword(
            Long userId,
            ChangePasswordRequest request
    );

    UserResponse updateUserStatus(
            Long userId,
            UpdateUserStatusRequest request
    );

    void deleteUser(Long userId);
}