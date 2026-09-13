package com.homestay.application.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DestinationRequest {

    @NotBlank(message = "Destination name is required.")
    @Size(max = 120, message = "Name cannot exceed 120 characters.")
    private String name;

    @NotBlank(message = "State is required.")
    @Size(max = 120, message = "State cannot exceed 120 characters.")
    private String state;

    @NotBlank(message = "Description is required.")
    private String description;

    private String image;

    @Min(value = 0, message = "Property count cannot be negative.")
    private Integer propertyCount;

    @Min(value = 0, message = "Display order cannot be negative.")
    private Integer displayOrder;

    private Boolean active;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getPropertyCount() {
        return propertyCount;
    }

    public void setPropertyCount(Integer propertyCount) {
        this.propertyCount = propertyCount;
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