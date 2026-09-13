package com.homestay.application.service;

import com.homestay.application.dto.request.LoginRequest;
import com.homestay.application.dto.request.RegisterRequest;
import com.homestay.application.dto.response.AuthResponse;
import com.homestay.application.dto.response.UserResponse;

public interface IAuthService {

    UserResponse registerUser(RegisterRequest request);

    AuthResponse loginUser(LoginRequest request);

    AuthResponse loginClient(LoginRequest request);

    AuthResponse loginAdmin(LoginRequest request);
}