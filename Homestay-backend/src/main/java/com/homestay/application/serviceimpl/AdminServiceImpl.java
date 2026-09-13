package com.homestay.application.serviceimpl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homestay.application.dto.request.UpdateBookingStatusRequest;
import com.homestay.application.dto.request.UpdateUserStatusRequest;
import com.homestay.application.dto.response.AdminDashboardResponse;
import com.homestay.application.dto.response.BookingResponse;
import com.homestay.application.dto.response.HomestayResponse;
import com.homestay.application.dto.response.UserResponse;
import com.homestay.application.mapper.BookingMapper;
import com.homestay.application.mapper.HomestayMapper;
import com.homestay.application.service.IAdminService;
import com.homestay.domain.entity.Booking;
import com.homestay.domain.entity.User;
import com.homestay.domain.enums.BookingStatus;
import com.homestay.domain.enums.HomestayStatus;
import com.homestay.domain.enums.Role;
import com.homestay.domain.enums.UserStatus;
import com.homestay.infrastructure.repository.BookingRepository;
import com.homestay.infrastructure.repository.HomestayRepository;
import com.homestay.infrastructure.repository.UserRepository;

@Service
@Transactional
public class AdminServiceImpl implements IAdminService {

    private final UserRepository userRepository;
    private final HomestayRepository homestayRepository;
    private final BookingRepository bookingRepository;

    public AdminServiceImpl(
            UserRepository userRepository,
            HomestayRepository homestayRepository,
            BookingRepository bookingRepository
    ) {
        this.userRepository = userRepository;
        this.homestayRepository = homestayRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        List<User> allUsers = userRepository.findAll();
        List<Booking> allBookings =
                bookingRepository.findAllByOrderByCreatedAtDesc();

        AdminDashboardResponse response =
                new AdminDashboardResponse();

        response.setTotalUsers(
                allUsers.stream()
                        .filter(user -> user.getRole() == Role.USER)
                        .count()
        );

        response.setActiveUsers(
                allUsers.stream()
                        .filter(user -> user.getRole() == Role.USER)
                        .filter(user ->
                                user.getStatus() == UserStatus.ACTIVE
                        )
                        .count()
        );

        response.setBlockedUsers(
                allUsers.stream()
                        .filter(user -> user.getRole() == Role.USER)
                        .filter(user ->
                                user.getStatus() == UserStatus.BLOCKED
                        )
                        .count()
        );

        response.setTotalClients(
                allUsers.stream()
                        .filter(user -> user.getRole() == Role.CLIENT)
                        .count()
        );

        response.setTotalHomestays(
                homestayRepository.count()
        );

        response.setActiveHomestays(
                homestayRepository
                        .findByStatus(HomestayStatus.ACTIVE)
                        .stream()
                        .count()
        );

        response.setTotalBookings(
                (long) allBookings.size()
        );

        response.setPendingBookings(
                allBookings.stream()
                        .filter(booking ->
                                booking.getStatus()
                                        == BookingStatus.PENDING
                        )
                        .count()
        );

        response.setConfirmedBookings(
                allBookings.stream()
                        .filter(booking ->
                                booking.getStatus()
                                        == BookingStatus.CONFIRMED
                        )
                        .count()
        );

        BigDecimal totalRevenue = allBookings.stream()
                .filter(booking ->
                        booking.getStatus() == BookingStatus.CONFIRMED
                                || booking.getStatus()
                                == BookingStatus.COMPLETED
                )
                .map(Booking::getTotalAmount)
                .filter(amount -> amount != null)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );

        response.setTotalRevenue(totalRevenue);

        List<BookingResponse> recentBookings =
                allBookings.stream()
                        .limit(5)
                        .map(BookingMapper::toResponse)
                        .toList();

        response.setRecentBookings(recentBookings);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers(
            String search,
            UserStatus status
    ) {
        return userRepository
                .findAll()
                .stream()
                .filter(user -> user.getRole() == Role.USER)
                .filter(user ->
                        status == null
                                || user.getStatus() == status
                )
                .filter(user -> matchesSearch(user, search))
                .map(this::mapToUserResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = getUserEntity(id);

        return mapToUserResponse(user);
    }

    @Override
    public UserResponse updateUserStatus(
            Long id,
            UpdateUserStatusRequest request
    ) {
        User user = getUserEntity(id);

        if (user.getRole() == Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Administrator status cannot be changed here."
            );
        }

        user.setStatus(request.getStatus());

        User updatedUser = userRepository.save(user);

        return mapToUserResponse(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomestayResponse> getAllHomestays() {
        return homestayRepository
                .findAll()
                .stream()
                .map(HomestayMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    @Override
    public BookingResponse updateBookingStatus(
            Long id,
            UpdateBookingStatusRequest request
    ) {
        Booking booking = bookingRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Booking not found with ID: " + id
                        )
                );

        booking.setStatus(request.getStatus());

        Booking updatedBooking =
                bookingRepository.save(booking);

        return BookingMapper.toResponse(updatedBooking);
    }

    private User getUserEntity(Long id) {
        return userRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found with ID: " + id
                        )
                );
    }

    private boolean matchesSearch(
            User user,
            String search
    ) {
        if (search == null || search.isBlank()) {
            return true;
        }

        String value = search.trim().toLowerCase();

        return user.getFullName()
                .toLowerCase()
                .contains(value)
                || user.getEmail()
                .toLowerCase()
                .contains(value)
                || user.getPhone()
                .toLowerCase()
                .contains(value);
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setAddress(user.getAddress());
        response.setCity(user.getCity());
        response.setState(user.getState());
        response.setPostalCode(user.getPostalCode());
        response.setProfileImage(user.getProfileImage());
        response.setRole(user.getRole());
        response.setStatus(user.getStatus());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        return response;
    }
}