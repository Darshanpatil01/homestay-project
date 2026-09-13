package com.homestay.application.service;

import java.util.List;

import com.homestay.application.dto.request.WishlistRequest;
import com.homestay.application.dto.response.WishlistResponse;
import com.homestay.application.dto.response.WishlistStatusResponse;

public interface IWishlistService {

    WishlistResponse addToWishlist(
            String userEmail,
            WishlistRequest request
    );

    List<WishlistResponse> getMyWishlist(
            String userEmail
    );

    WishlistStatusResponse checkWishlistStatus(
            String userEmail,
            Long homestayId
    );

    void removeFromWishlist(
            String userEmail,
            Long homestayId
    );
}