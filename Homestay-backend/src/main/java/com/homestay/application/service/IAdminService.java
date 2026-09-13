package com.homestay.application.service;

import java.util.List;

import com.homestay.application.dto.request.UpdateBookingStatusRequest;
import com.homestay.application.dto.request.UpdateUserStatusRequest;
import com.homestay.application.dto.response.AdminDashboardResponse;
import com.homestay.application.dto.response.BookingResponse;
import com.homestay.application.dto.response.HomestayResponse;
import com.homestay.application.dto.response.UserResponse;
import com.homestay.domain.enums.UserStatus;

public interface IAdminService {

    AdminDashboardResponse getDashboard();

    List<UserResponse> getAllUsers(
            String search,
            UserStatus status
    );

    UserResponse getUserById(Long id);

    UserResponse updateUserStatus(
            Long id,
            UpdateUserStatusRequest request
    );

    List<HomestayResponse> getAllHomestays();

    List<BookingResponse> getAllBookings();

    BookingResponse updateBookingStatus(
            Long id,
            UpdateBookingStatusRequest request
    );
}