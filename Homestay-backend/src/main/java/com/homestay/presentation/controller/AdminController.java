package com.homestay.presentation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.homestay.application.dto.request.UpdateBookingStatusRequest;
import com.homestay.application.dto.request.UpdateUserStatusRequest;
import com.homestay.application.dto.response.AdminDashboardResponse;
import com.homestay.application.dto.response.BookingResponse;
import com.homestay.application.dto.response.HomestayResponse;
import com.homestay.application.dto.response.UserResponse;
import com.homestay.application.service.IAdminService;
import com.homestay.domain.enums.UserStatus;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final IAdminService adminService;

    public AdminController(
            IAdminService adminService
    ) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse>
            getDashboard() {

        return ResponseEntity.ok(
                adminService.getDashboard()
        );
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>>
            getAllUsers(
                    @RequestParam(required = false)
                    String search,

                    @RequestParam(required = false)
                    UserStatus status
            ) {

        return ResponseEntity.ok(
                adminService.getAllUsers(
                        search,
                        status
                )
        );
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                adminService.getUserById(id)
        );
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable Long id,
            @Valid
            @RequestBody UpdateUserStatusRequest request
    ) {
        return ResponseEntity.ok(
                adminService.updateUserStatus(
                        id,
                        request
                )
        );
    }

    @GetMapping("/homestays")
    public ResponseEntity<List<HomestayResponse>>
            getAllHomestays() {

        return ResponseEntity.ok(
                adminService.getAllHomestays()
        );
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>>
            getAllBookings() {

        return ResponseEntity.ok(
                adminService.getAllBookings()
        );
    }

    @PatchMapping("/bookings/{id}/status")
    public ResponseEntity<BookingResponse>
            updateBookingStatus(
                    @PathVariable Long id,
                    @Valid
                    @RequestBody
                    UpdateBookingStatusRequest request
            ) {

        return ResponseEntity.ok(
                adminService.updateBookingStatus(
                        id,
                        request
                )
        );
    }
}