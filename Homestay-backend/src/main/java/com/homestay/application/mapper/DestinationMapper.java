package com.homestay.application.mapper;

import com.homestay.application.dto.request.DestinationRequest;
import com.homestay.application.dto.response.DestinationResponse;
import com.homestay.domain.entity.Destination;

public final class DestinationMapper {

    private DestinationMapper() {
    }

    public static Destination toEntity(
            DestinationRequest request
    ) {
        Destination destination = new Destination();

        updateEntity(destination, request);

        return destination;
    }

    public static void updateEntity(
            Destination destination,
            DestinationRequest request
    ) {
        destination.setName(request.getName().trim());
        destination.setState(request.getState().trim());
        destination.setDescription(
                request.getDescription().trim()
        );
        destination.setImage(request.getImage());

        destination.setPropertyCount(
                request.getPropertyCount() != null
                        ? request.getPropertyCount()
                        : 0
        );

        destination.setDisplayOrder(
                request.getDisplayOrder() != null
                        ? request.getDisplayOrder()
                        : 0
        );

        destination.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );
    }

    public static DestinationResponse toResponse(
            Destination destination
    ) {
        DestinationResponse response =
                new DestinationResponse();

        response.setId(destination.getId());
        response.setName(destination.getName());
        response.setState(destination.getState());
        response.setDescription(destination.getDescription());
        response.setImage(destination.getImage());
        response.setPropertyCount(
                destination.getPropertyCount()
        );
        response.setDisplayOrder(
                destination.getDisplayOrder()
        );
        response.setActive(destination.getActive());
        response.setCreatedAt(destination.getCreatedAt());
        response.setUpdatedAt(destination.getUpdatedAt());

        return response;
    }
}