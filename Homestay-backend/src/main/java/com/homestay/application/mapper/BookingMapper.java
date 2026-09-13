package com.homestay.application.mapper;

import com.homestay.application.dto.response.BookingResponse;
import com.homestay.domain.entity.Booking;

public final class BookingMapper {

    private BookingMapper() {
    }

    public static BookingResponse toResponse(
            Booking booking
    ) {
        BookingResponse response = new BookingResponse();

        response.setId(booking.getId());
        response.setBookingNumber(
                booking.getBookingNumber()
        );

        response.setUserId(
                booking.getUser().getId()
        );

        response.setGuestName(
                booking.getUser().getFullName()
        );

        response.setGuestEmail(
                booking.getUser().getEmail()
        );

        response.setGuestPhone(
                booking.getUser().getPhone()
        );

        response.setHomestayId(
                booking.getHomestay().getId()
        );

        response.setHomestayName(
                booking.getHomestay().getName()
        );

        response.setHomestayLocation(
                booking.getHomestay().getLocation()
        );

        response.setHomestayImage(
                booking.getHomestay().getImage()
        );

        response.setCheckIn(booking.getCheckIn());
        response.setCheckOut(booking.getCheckOut());
        response.setGuests(booking.getGuests());
        response.setNights(booking.getNights());
        response.setPricePerNight(
                booking.getPricePerNight()
        );
        response.setSubtotal(booking.getSubtotal());
        response.setServiceFee(booking.getServiceFee());
        response.setTotalAmount(booking.getTotalAmount());
        response.setSpecialRequest(
                booking.getSpecialRequest()
        );
        response.setStatus(booking.getStatus());
        response.setCreatedAt(booking.getCreatedAt());
        response.setUpdatedAt(booking.getUpdatedAt());

        return response;
    }
}