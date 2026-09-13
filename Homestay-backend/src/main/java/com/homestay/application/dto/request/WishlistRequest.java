package com.homestay.application.dto.request;

import jakarta.validation.constraints.NotNull;

public class WishlistRequest {

    @NotNull(message = "Homestay ID is required.")
    private Long homestayId;

    public Long getHomestayId() {
        return homestayId;
    }

    public void setHomestayId(Long homestayId) {
        this.homestayId = homestayId;
    }
}