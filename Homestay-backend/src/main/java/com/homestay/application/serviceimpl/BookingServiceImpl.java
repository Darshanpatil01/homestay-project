package com.homestay.application.serviceimpl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homestay.application.dto.request.BookingRequest;
import com.homestay.application.dto.request.UpdateBookingStatusRequest;
import com.homestay.application.dto.response.BookingResponse;
import com.homestay.application.mapper.BookingMapper;
import com.homestay.application.service.IBookingService;
import com.homestay.domain.entity.Booking;
import com.homestay.domain.entity.Homestay;
import com.homestay.domain.entity.User;
import com.homestay.domain.enums.BookingStatus;
import com.homestay.domain.enums.HomestayStatus;
import com.homestay.infrastructure.repository.BookingRepository;
import com.homestay.infrastructure.repository.HomestayRepository;
import com.homestay.infrastructure.repository.UserRepository;

@Service
@Transactional
public class BookingServiceImpl
        implements IBookingService {

    private static final BigDecimal SERVICE_FEE_RATE =
            new BigDecimal("0.10");

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final HomestayRepository homestayRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            HomestayRepository homestayRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.homestayRepository = homestayRepository;
    }

    @Override
    public BookingResponse createBooking(
            String userEmail,
            BookingRequest request
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

        if (!request.getCheckOut().isAfter(
                request.getCheckIn()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Check-out date must be after check-in date."
            );
        }

        if (request.getGuests() > homestay.getGuests()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Guest count exceeds the property capacity."
            );
        }

        long calculatedNights = ChronoUnit.DAYS.between(
                request.getCheckIn(),
                request.getCheckOut()
        );

        if (calculatedNights > Integer.MAX_VALUE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Booking duration is too large."
            );
        }

        int nights = (int) calculatedNights;

        BigDecimal pricePerNight =
                homestay.getPricePerNight();

        BigDecimal subtotal = pricePerNight.multiply(
                BigDecimal.valueOf(nights)
        );

        BigDecimal serviceFee = subtotal
                .multiply(SERVICE_FEE_RATE)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalAmount =
                subtotal.add(serviceFee);

        Booking booking = new Booking();

        booking.setBookingNumber(
                generateBookingNumber()
        );
        booking.setUser(user);
        booking.setHomestay(homestay);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setGuests(request.getGuests());
        booking.setNights(nights);
        booking.setPricePerNight(pricePerNight);
        booking.setSubtotal(subtotal);
        booking.setServiceFee(serviceFee);
        booking.setTotalAmount(totalAmount);
        booking.setSpecialRequest(
                request.getSpecialRequest()
        );
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking =
                bookingRepository.save(booking);

        return BookingMapper.toResponse(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(
            String userEmail
    ) {
        User user = getUserByEmail(userEmail);

        return bookingRepository
                .findByUserIdOrderByCreatedAtDesc(
                        user.getId()
                )
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getMyBookingById(
            String userEmail,
            Long bookingId
    ) {
        User user = getUserByEmail(userEmail);
        Booking booking = getBookingEntity(bookingId);

        verifyBookingOwner(booking, user);

        return BookingMapper.toResponse(booking);
    }

    @Override
    public BookingResponse cancelMyBooking(
            String userEmail,
            Long bookingId
    ) {
        User user = getUserByEmail(userEmail);
        Booking booking = getBookingEntity(bookingId);

        verifyBookingOwner(booking, user);

        if (booking.getStatus() == BookingStatus.COMPLETED
                || booking.getStatus() == BookingStatus.CANCELLED
                || booking.getStatus() == BookingStatus.REJECTED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This booking cannot be cancelled."
            );
        }

        booking.setStatus(BookingStatus.CANCELLED);

        return BookingMapper.toResponse(
                bookingRepository.save(booking)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse>
            getAllBookingsForClient() {

        return bookingRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    @Override
    public BookingResponse updateBookingStatus(
            Long bookingId,
            UpdateBookingStatusRequest request
    ) {
        Booking booking = getBookingEntity(bookingId);

        booking.setStatus(request.getStatus());

        return BookingMapper.toResponse(
                bookingRepository.save(booking)
        );
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

    private Booking getBookingEntity(Long bookingId) {
        return bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Booking not found with ID: "
                                        + bookingId
                        )
                );
    }

    private void verifyBookingOwner(
            Booking booking,
            User user
    ) {
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot access this booking."
            );
        }
    }

    private String generateBookingNumber() {
        String bookingNumber;

        do {
            bookingNumber = "SN-"
                    + UUID.randomUUID()
                            .toString()
                            .replace("-", "")
                            .substring(0, 10)
                            .toUpperCase();
        } while (
                bookingRepository.existsByBookingNumber(
                        bookingNumber
                )
        );

        return bookingNumber;
    }
}