package com.homestay.application.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class NavigationLinkRequest {

    @NotBlank(message = "Navigation label is required.")
    @Size(max = 100)
    private String label;

    @NotBlank(message = "Navigation path is required.")
    @Size(max = 250)
    private String path;

    @Min(value = 0, message = "Display order cannot be negative.")
    private Integer displayOrder;

    private Boolean active;

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
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