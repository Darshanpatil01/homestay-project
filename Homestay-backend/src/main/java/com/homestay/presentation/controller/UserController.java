package com.homestay.presentation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homestay.application.dto.request.ChangePasswordRequest;
import com.homestay.application.dto.request.UpdateProfileRequest;
import com.homestay.application.dto.request.UpdateUserStatusRequest;
import com.homestay.application.dto.response.UserResponse;
import com.homestay.application.service.IUserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final IUserService userService;

    public UserController(
            IUserService userService
    ) {

        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>>
            getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse>
            getUserById(
                    @PathVariable Long userId
            ) {

        return ResponseEntity.ok(
                userService.getUserById(userId)
        );
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<UserResponse>
            updateProfile(
                    @PathVariable Long userId,
                    @Valid
                    @RequestBody
                    UpdateProfileRequest request
            ) {

        return ResponseEntity.ok(
                userService.updateProfile(
                        userId,
                        request
                )
        );
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<Void>
            changePassword(
                    @PathVariable Long userId,
                    @Valid
                    @RequestBody
                    ChangePasswordRequest request
            ) {

        userService.changePassword(
                userId,
                request
        );

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{userId}/status")
    public ResponseEntity<UserResponse>
            updateUserStatus(
                    @PathVariable Long userId,
                    @Valid
                    @RequestBody
                    UpdateUserStatusRequest request
            ) {

        return ResponseEntity.ok(
                userService.updateUserStatus(
                        userId,
                        request
                )
        );
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long userId
    ) {

        userService.deleteUser(userId);

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
}