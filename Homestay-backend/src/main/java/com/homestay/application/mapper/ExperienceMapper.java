package com.homestay.application.mapper;

import com.homestay.application.dto.request.ExperienceRequest;
import com.homestay.application.dto.response.ExperienceResponse;
import com.homestay.domain.entity.Experience;

public final class ExperienceMapper {

    private ExperienceMapper() {
    }

    public static Experience toEntity(
            ExperienceRequest request
    ) {
        Experience experience = new Experience();

        updateEntity(experience, request);

        return experience;
    }

    public static void updateEntity(
            Experience experience,
            ExperienceRequest request
    ) {
        experience.setTitle(request.getTitle().trim());

        experience.setDescription(
                request.getDescription().trim()
        );

        experience.setImage(request.getImage());

        experience.setDisplayOrder(
                request.getDisplayOrder() != null
                        ? request.getDisplayOrder()
                        : 0
        );

        experience.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );
    }

    public static ExperienceResponse toResponse(
            Experience experience
    ) {
        ExperienceResponse response =
                new ExperienceResponse();

        response.setId(experience.getId());
        response.setTitle(experience.getTitle());
        response.setDescription(experience.getDescription());
        response.setImage(experience.getImage());
        response.setDisplayOrder(experience.getDisplayOrder());
        response.setActive(experience.getActive());
        response.setCreatedAt(experience.getCreatedAt());
        response.setUpdatedAt(experience.getUpdatedAt());

        return response;
    }
}