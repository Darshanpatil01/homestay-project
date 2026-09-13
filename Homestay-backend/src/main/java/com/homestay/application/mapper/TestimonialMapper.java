package com.homestay.application.mapper;

import com.homestay.application.dto.request.TestimonialRequest;
import com.homestay.application.dto.response.TestimonialResponse;
import com.homestay.domain.entity.Testimonial;

public final class TestimonialMapper {

    private TestimonialMapper() {
    }

    public static Testimonial toEntity(
            TestimonialRequest request
    ) {
        Testimonial testimonial = new Testimonial();

        updateEntity(testimonial, request);

        return testimonial;
    }

    public static void updateEntity(
            Testimonial testimonial,
            TestimonialRequest request
    ) {
        testimonial.setGuestName(
                request.getGuestName().trim()
        );

        testimonial.setGuestLocation(
                request.getGuestLocation().trim()
        );

        testimonial.setComment(
                request.getComment().trim()
        );

        testimonial.setRating(request.getRating());

        testimonial.setInitials(
                generateInitials(
                        request.getInitials(),
                        request.getGuestName()
                )
        );

        testimonial.setGuestImage(
                request.getGuestImage()
        );

        testimonial.setDisplayOrder(
                request.getDisplayOrder() != null
                        ? request.getDisplayOrder()
                        : 0
        );

        testimonial.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );
    }

    public static TestimonialResponse toResponse(
            Testimonial testimonial
    ) {
        TestimonialResponse response =
                new TestimonialResponse();

        response.setId(testimonial.getId());
        response.setGuestName(testimonial.getGuestName());
        response.setGuestLocation(
                testimonial.getGuestLocation()
        );
        response.setComment(testimonial.getComment());
        response.setRating(testimonial.getRating());
        response.setInitials(testimonial.getInitials());
        response.setGuestImage(testimonial.getGuestImage());
        response.setDisplayOrder(
                testimonial.getDisplayOrder()
        );
        response.setActive(testimonial.getActive());
        response.setCreatedAt(testimonial.getCreatedAt());
        response.setUpdatedAt(testimonial.getUpdatedAt());

        return response;
    }

    private static String generateInitials(
            String requestedInitials,
            String guestName
    ) {
        if (requestedInitials != null
                && !requestedInitials.isBlank()) {
            return requestedInitials
                    .trim()
                    .toUpperCase();
        }

        String[] nameParts = guestName.trim().split("\\s+");

        StringBuilder initials = new StringBuilder();

        for (String namePart : nameParts) {
            if (!namePart.isBlank()) {
                initials.append(
                        Character.toUpperCase(
                                namePart.charAt(0)
                        )
                );
            }

            if (initials.length() == 2) {
                break;
            }
        }

        return initials.toString();
    }
}