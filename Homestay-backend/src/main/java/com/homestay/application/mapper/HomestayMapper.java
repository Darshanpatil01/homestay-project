package com.homestay.application.mapper;

import java.math.BigDecimal;

import com.homestay.application.dto.request.HomestayRequest;
import com.homestay.application.dto.response.HomestayResponse;
import com.homestay.domain.entity.Homestay;
import com.homestay.domain.enums.HomestayStatus;

public final class HomestayMapper {

    private HomestayMapper() {
    }

    public static Homestay toEntity(HomestayRequest request) {
        Homestay homestay = new Homestay();

        updateEntity(homestay, request);

        return homestay;
    }

    public static void updateEntity(
            Homestay homestay,
            HomestayRequest request
    ) {
        homestay.setName(request.getName().trim());
        homestay.setLocation(request.getLocation().trim());
        homestay.setCategory(request.getCategory());
        homestay.setDescription(request.getDescription().trim());
        homestay.setPricePerNight(request.getPricePerNight());
        homestay.setGuests(request.getGuests());
        homestay.setBedrooms(request.getBedrooms());
        homestay.setBathrooms(request.getBathrooms());

        homestay.setRating(
                request.getRating() != null
                        ? request.getRating()
                        : BigDecimal.ZERO
        );

        homestay.setImage(request.getImage());

        homestay.setFeatured(
                request.getFeatured() != null
                        ? request.getFeatured()
                        : false
        );

        homestay.setStatus(
                request.getStatus() != null
                        ? request.getStatus()
                        : HomestayStatus.ACTIVE
        );
    }

    public static HomestayResponse toResponse(
            Homestay homestay
    ) {
        HomestayResponse response = new HomestayResponse();

        response.setId(homestay.getId());
        response.setName(homestay.getName());
        response.setLocation(homestay.getLocation());
        response.setCategory(homestay.getCategory());
        response.setDescription(homestay.getDescription());
        response.setPricePerNight(homestay.getPricePerNight());
        response.setGuests(homestay.getGuests());
        response.setBedrooms(homestay.getBedrooms());
        response.setBathrooms(homestay.getBathrooms());
        response.setRating(homestay.getRating());
        response.setImage(homestay.getImage());
        response.setFeatured(homestay.getFeatured());
        response.setStatus(homestay.getStatus());
        response.setCreatedAt(homestay.getCreatedAt());
        response.setUpdatedAt(homestay.getUpdatedAt());

        return response;
    }
}