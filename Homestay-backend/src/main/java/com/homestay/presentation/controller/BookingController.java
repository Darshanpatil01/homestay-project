package com.homestay.presentation.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.homestay.application.dto.request.BookingRequest;
import com.homestay.application.dto.request.UpdateBookingStatusRequest;
import com.homestay.application.dto.response.BookingResponse;
import com.homestay.application.service.IBookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class BookingController {

    private final IBookingService bookingService;

    public BookingController(
            IBookingService bookingService
    ) {
        this.bookingService = bookingService;
    }

    // Logged-in user endpoints

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> createBooking(
            Principal principal,
            @Valid @RequestBody BookingRequest request
    ) {
        BookingResponse createdBooking =
                bookingService.createBooking(
                        principal.getName(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdBooking);
    }

    @GetMapping("/bookings/my")
    public ResponseEntity<List<BookingResponse>>
            getMyBookings(
                    Principal principal
            ) {

        return ResponseEntity.ok(
                bookingService.getMyBookings(
                        principal.getName()
                )
        );
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<BookingResponse>
            getMyBookingById(
                    Principal principal,
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                bookingService.getMyBookingById(
                        principal.getName(),
                        id
                )
        );
    }

    @PatchMapping("/bookings/{id}/cancel")
    public ResponseEntity<BookingResponse>
            cancelMyBooking(
                    Principal principal,
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                bookingService.cancelMyBooking(
                        principal.getName(),
                        id
                )
        );
    }

    // Client and Admin endpoints

    @GetMapping("/client/bookings")
    public ResponseEntity<List<BookingResponse>>
            getAllBookingsForClient() {

        return ResponseEntity.ok(
                bookingService.getAllBookingsForClient()
        );
    }

    @PatchMapping("/client/bookings/{id}/status")
    public ResponseEntity<BookingResponse>
            updateBookingStatus(
                    @PathVariable Long id,
                    @Valid
                    @RequestBody
                    UpdateBookingStatusRequest request
            ) {

        return ResponseEntity.ok(
                bookingService.updateBookingStatus(
                        id,
                        request
                )
        );
    }
}