package com.homestay.application.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BenefitRequest {

    @NotBlank(message = "Benefit title is required.")
    @Size(
            max = 150,
            message = "Benefit title cannot exceed 150 characters."
    )
    private String title;

    @NotBlank(message = "Benefit description is required.")
    private String description;

    @NotBlank(message = "Icon name is required.")
    @Size(
            max = 100,
            message = "Icon name cannot exceed 100 characters."
    )
    private String iconName;

    @Min(
            value = 0,
            message = "Display order cannot be negative."
    )
    private Integer displayOrder;

    private Boolean active;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
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