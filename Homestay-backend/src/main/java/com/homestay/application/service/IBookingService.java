package com.homestay.application.service;

import java.util.List;

import com.homestay.application.dto.request.BookingRequest;
import com.homestay.application.dto.request.UpdateBookingStatusRequest;
import com.homestay.application.dto.response.BookingResponse;

public interface IBookingService {

    BookingResponse createBooking(
            String userEmail,
            BookingRequest request
    );

    List<BookingResponse> getMyBookings(
            String userEmail
    );

    BookingResponse getMyBookingById(
            String userEmail,
            Long bookingId
    );

    BookingResponse cancelMyBooking(
            String userEmail,
            Long bookingId
    );

    List<BookingResponse> getAllBookingsForClient();

    BookingResponse updateBookingStatus(
            Long bookingId,
            UpdateBookingStatusRequest request
    );
}