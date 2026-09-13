package com.homestay.application.mapper;

import com.homestay.application.dto.response.WishlistResponse;
import com.homestay.domain.entity.Homestay;
import com.homestay.domain.entity.Wishlist;

public final class WishlistMapper {

    private WishlistMapper() {
    }

    public static WishlistResponse toResponse(
            Wishlist wishlist
    ) {
        Homestay homestay = wishlist.getHomestay();

        WishlistResponse response =
                new WishlistResponse();

        response.setWishlistId(wishlist.getId());
        response.setHomestayId(homestay.getId());
        response.setName(homestay.getName());
        response.setLocation(homestay.getLocation());
        response.setCategory(homestay.getCategory());
        response.setDescription(homestay.getDescription());
        response.setPricePerNight(
                homestay.getPricePerNight()
        );
        response.setGuests(homestay.getGuests());
        response.setBedrooms(homestay.getBedrooms());
        response.setBathrooms(homestay.getBathrooms());
        response.setRating(homestay.getRating());
        response.setImage(homestay.getImage());
        response.setFeatured(homestay.getFeatured());
        response.setSavedAt(wishlist.getCreatedAt());

        return response;
    }
}