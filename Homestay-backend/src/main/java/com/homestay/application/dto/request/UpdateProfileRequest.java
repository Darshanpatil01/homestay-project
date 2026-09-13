package com.homestay.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(
            min = 3,
            max = 100,
            message = "Full name must contain between 3 and 100 characters"
    )
    private String fullName;

    @NotBlank(message = "Email address is required")
    @Email(message = "Enter a valid email address")
    @Size(
            max = 150,
            message = "Email address is too long"
    )
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[6-9][0-9]{9}$",
            message = "Enter a valid 10-digit Indian phone number"
    )
    private String phone;

    @Size(
            max = 255,
            message = "Address cannot exceed 255 characters"
    )
    private String address;

    @Size(
            max = 100,
            message = "City cannot exceed 100 characters"
    )
    private String city;

    @Size(
            max = 100,
            message = "State cannot exceed 100 characters"
    )
    private String state;

    @Pattern(
            regexp = "^$|^[0-9]{6}$",
            message = "Postal code must contain 6 digits"
    )
    private String postalCode;

    @Size(
            max = 500,
            message = "Profile image path is too long"
    )
    private String profileImage;

    public UpdateProfileRequest() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(
            String postalCode
    ) {
        this.postalCode = postalCode;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(
            String profileImage
    ) {
        this.profileImage = profileImage;
    }
}