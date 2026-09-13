package com.homestay.application.dto.request;

import java.math.BigDecimal;

import com.homestay.domain.enums.HomestayStatus;

import jakarta.validation.constraints.*;

public class HomestayRequest {

    @NotBlank(message = "Homestay name is required.")
    @Size(max = 150, message = "Name cannot exceed 150 characters.")
    private String name;

    @NotBlank(message = "Location is required.")
    @Size(max = 150, message = "Location cannot exceed 150 characters.")
    private String location;

    @Size(max = 100, message = "Category cannot exceed 100 characters.")
    private String category;

    @NotBlank(message = "Description is required.")
    private String description;

    @NotNull(message = "Price per night is required.")
    @DecimalMin(
            value = "1.00",
            message = "Price per night must be greater than zero."
    )
    private BigDecimal pricePerNight;

    @NotNull(message = "Guest capacity is required.")
    @Min(value = 1, message = "Guest capacity must be at least 1.")
    private Integer guests;

    @NotNull(message = "Number of bedrooms is required.")
    @Min(value = 1, message = "Bedrooms must be at least 1.")
    private Integer bedrooms;

    @NotNull(message = "Number of bathrooms is required.")
    @Min(value = 1, message = "Bathrooms must be at least 1.")
    private Integer bathrooms;

    @DecimalMin(value = "0.0", message = "Rating cannot be negative.")
    @DecimalMax(value = "5.0", message = "Rating cannot exceed 5.")
    private BigDecimal rating;

    private String image;

    private Boolean featured;

    private HomestayStatus status;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public Integer getGuests() {
        return guests;
    }

    public void setGuests(Integer guests) {
        this.guests = guests;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(Integer bathrooms) {
        this.bathrooms = bathrooms;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public HomestayStatus getStatus() {
        return status;
    }

    public void setStatus(HomestayStatus status) {
        this.status = status;
    }
}