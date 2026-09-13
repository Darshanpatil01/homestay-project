package com.homestay.application.mapper;

import com.homestay.application.dto.request.BenefitRequest;
import com.homestay.application.dto.response.BenefitResponse;
import com.homestay.domain.entity.Benefit;

public final class BenefitMapper {

    private BenefitMapper() {
    }

    public static Benefit toEntity(
            BenefitRequest request
    ) {
        Benefit benefit = new Benefit();

        updateEntity(benefit, request);

        return benefit;
    }

    public static void updateEntity(
            Benefit benefit,
            BenefitRequest request
    ) {
        benefit.setTitle(request.getTitle().trim());

        benefit.setDescription(
                request.getDescription().trim()
        );

        benefit.setIconName(
                request.getIconName().trim()
        );

        benefit.setDisplayOrder(
                request.getDisplayOrder() != null
                        ? request.getDisplayOrder()
                        : 0
        );

        benefit.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );
    }

    public static BenefitResponse toResponse(
            Benefit benefit
    ) {
        BenefitResponse response = new BenefitResponse();

        response.setId(benefit.getId());
        response.setTitle(benefit.getTitle());
        response.setDescription(benefit.getDescription());
        response.setIconName(benefit.getIconName());
        response.setDisplayOrder(benefit.getDisplayOrder());
        response.setActive(benefit.getActive());
        response.setCreatedAt(benefit.getCreatedAt());
        response.setUpdatedAt(benefit.getUpdatedAt());

        return response;
    }
}