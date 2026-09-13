package com.homestay.presentation.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.homestay.application.dto.request.WishlistRequest;
import com.homestay.application.dto.response.WishlistResponse;
import com.homestay.application.dto.response.WishlistStatusResponse;
import com.homestay.application.service.IWishlistService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final IWishlistService wishlistService;

    public WishlistController(
            IWishlistService wishlistService
    ) {
        this.wishlistService = wishlistService;
    }

    @PostMapping
    public ResponseEntity<WishlistResponse>
            addToWishlist(
                    Principal principal,
                    @Valid
                    @RequestBody WishlistRequest request
            ) {

        WishlistResponse response =
                wishlistService.addToWishlist(
                        principal.getName(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<WishlistResponse>>
            getMyWishlist(
                    Principal principal
            ) {

        return ResponseEntity.ok(
                wishlistService.getMyWishlist(
                        principal.getName()
                )
        );
    }

    @GetMapping("/check/{homestayId}")
    public ResponseEntity<WishlistStatusResponse>
            checkWishlistStatus(
                    Principal principal,
                    @PathVariable Long homestayId
            ) {

        return ResponseEntity.ok(
                wishlistService.checkWishlistStatus(
                        principal.getName(),
                        homestayId
                )
        );
    }

    @DeleteMapping("/{homestayId}")
    public ResponseEntity<Void> removeFromWishlist(
            Principal principal,
            @PathVariable Long homestayId
    ) {
        wishlistService.removeFromWishlist(
                principal.getName(),
                homestayId
        );

        return ResponseEntity.noContent().build();
    }
}