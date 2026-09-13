package com.homestay.application.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class BookingRequest {

    @NotNull(message = "Homestay ID is required.")
    private Long homestayId;

    @NotNull(message = "Check-in date is required.")
    @FutureOrPresent(
            message = "Check-in date cannot be in the past."
    )
    private LocalDate checkIn;

    @NotNull(message = "Check-out date is required.")
    @FutureOrPresent(
            message = "Check-out date cannot be in the past."
    )
    private LocalDate checkOut;

    @NotNull(message = "Number of guests is required.")
    @Min(value = 1, message = "At least one guest is required.")
    private Integer guests;

    @Size(
            max = 1000,
            message = "Special request cannot exceed 1000 characters."
    )
    private String specialRequest;

    public Long getHomestayId() {
        return homestayId;
    }

    public void setHomestayId(Long homestayId) {
        this.homestayId = homestayId;
    }

    public LocalDate getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(LocalDate checkIn) {
        this.checkIn = checkIn;
    }

    public LocalDate getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(LocalDate checkOut) {
        this.checkOut = checkOut;
    }

    public Integer getGuests() {
        return guests;
    }

    public void setGuests(Integer guests) {
        this.guests = guests;
    }

    public String getSpecialRequest() {
        return specialRequest;
    }

    public void setSpecialRequest(String specialRequest) {
        this.specialRequest = specialRequest;
    }
}