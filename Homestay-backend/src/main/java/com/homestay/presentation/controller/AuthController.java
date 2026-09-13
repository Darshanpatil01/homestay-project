package com.homestay.presentation.controller;

import com.homestay.application.dto.request.LoginRequest;
import com.homestay.application.dto.request.RegisterRequest;
import com.homestay.application.dto.response.AuthResponse;
import com.homestay.application.dto.response.UserResponse;
import com.homestay.application.service.IAuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final IAuthService authService;

    public AuthController(IAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(
            @Valid @RequestBody RegisterRequest request
    ) {
        UserResponse response = authService.registerUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
                authService.loginUser(request)
        );
    }

    @PostMapping("/client/login")
    public ResponseEntity<AuthResponse> loginClient(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
                authService.loginClient(request)
        );
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> loginAdmin(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
                authService.loginAdmin(request)
        );
    }
}