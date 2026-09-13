package com.homestay.application.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ExperienceRequest {

    @NotBlank(message = "Experience title is required.")
    @Size(
            max = 150,
            message = "Experience title cannot exceed 150 characters."
    )
    private String title;

    @NotBlank(message = "Experience description is required.")
    private String description;

    private String image;

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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
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