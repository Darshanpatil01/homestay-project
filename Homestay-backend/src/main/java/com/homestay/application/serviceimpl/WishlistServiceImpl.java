package com.homestay.application.serviceimpl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homestay.application.dto.request.WishlistRequest;
import com.homestay.application.dto.response.WishlistResponse;
import com.homestay.application.dto.response.WishlistStatusResponse;
import com.homestay.application.mapper.WishlistMapper;
import com.homestay.application.service.IWishlistService;
import com.homestay.domain.entity.Homestay;
import com.homestay.domain.entity.User;
import com.homestay.domain.entity.Wishlist;
import com.homestay.domain.enums.HomestayStatus;
import com.homestay.infrastructure.repository.HomestayRepository;
import com.homestay.infrastructure.repository.UserRepository;
import com.homestay.infrastructure.repository.WishlistRepository;

@Service
@Transactional
public class WishlistServiceImpl
        implements IWishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final HomestayRepository homestayRepository;

    public WishlistServiceImpl(
            WishlistRepository wishlistRepository,
            UserRepository userRepository,
            HomestayRepository homestayRepository
    ) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.homestayRepository = homestayRepository;
    }

    @Override
    public WishlistResponse addToWishlist(
            String userEmail,
            WishlistRequest request
    ) {
        User user = getUserByEmail(userEmail);

        Homestay homestay = homestayRepository
                .findById(request.getHomestayId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Homestay not found."
                        )
                );

        if (homestay.getStatus() != HomestayStatus.ACTIVE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This homestay is currently unavailable."
            );
        }

        if (wishlistRepository
                .existsByUserIdAndHomestayId(
                        user.getId(),
                        homestay.getId()
                )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This homestay is already in your wishlist."
            );
        }

        Wishlist wishlist = new Wishlist();

        wishlist.setUser(user);
        wishlist.setHomestay(homestay);

        Wishlist savedWishlist =
                wishlistRepository.save(wishlist);

        return WishlistMapper.toResponse(savedWishlist);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WishlistResponse> getMyWishlist(
            String userEmail
    ) {
        User user = getUserByEmail(userEmail);

        return wishlistRepository
                .findByUserIdOrderByCreatedAtDesc(
                        user.getId()
                )
                .stream()
                .map(WishlistMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public WishlistStatusResponse checkWishlistStatus(
            String userEmail,
            Long homestayId
    ) {
        User user = getUserByEmail(userEmail);

        boolean saved = wishlistRepository
                .existsByUserIdAndHomestayId(
                        user.getId(),
                        homestayId
                );

        return new WishlistStatusResponse(
                homestayId,
                saved
        );
    }

    @Override
    public void removeFromWishlist(
            String userEmail,
            Long homestayId
    ) {
        User user = getUserByEmail(userEmail);

        Wishlist wishlist = wishlistRepository
                .findByUserIdAndHomestayId(
                        user.getId(),
                        homestayId
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "This homestay is not in your wishlist."
                        )
                );

        wishlistRepository.delete(wishlist);
    }

    private User getUserByEmail(String email) {
        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User account not found."
                        )
                );
    }
}