package com.homestay.application.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TestimonialRequest {

    @NotBlank(message = "Guest name is required.")
    @Size(
            max = 150,
            message = "Guest name cannot exceed 150 characters."
    )
    private String guestName;

    @NotBlank(message = "Guest location is required.")
    @Size(
            max = 150,
            message = "Guest location cannot exceed 150 characters."
    )
    private String guestLocation;

    @NotBlank(message = "Testimonial comment is required.")
    private String comment;

    @NotNull(message = "Rating is required.")
    @Min(value = 1, message = "Rating must be at least 1.")
    @Max(value = 5, message = "Rating cannot exceed 5.")
    private Integer rating;

    @Size(
            max = 10,
            message = "Initials cannot exceed 10 characters."
    )
    private String initials;

    private String guestImage;

    @Min(
            value = 0,
            message = "Display order cannot be negative."
    )
    private Integer displayOrder;

    private Boolean active;

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getGuestLocation() {
        return guestLocation;
    }

    public void setGuestLocation(String guestLocation) {
        this.guestLocation = guestLocation;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getInitials() {
        return initials;
    }

    public void setInitials(String initials) {
        this.initials = initials;
    }

    public String getGuestImage() {
        return guestImage;
    }

    public void setGuestImage(String guestImage) {
        this.guestImage = guestImage;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}