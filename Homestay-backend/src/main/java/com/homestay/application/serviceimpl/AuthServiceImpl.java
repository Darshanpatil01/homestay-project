package com.homestay.application.serviceimpl;

import com.homestay.application.dto.request.LoginRequest;
import com.homestay.application.dto.request.RegisterRequest;
import com.homestay.application.dto.response.AuthResponse;
import com.homestay.application.dto.response.UserResponse;
import com.homestay.application.service.IAuthService;
import com.homestay.domain.entity.User;
import com.homestay.domain.enums.Role;
import com.homestay.domain.enums.UserStatus;
import com.homestay.infrastructure.repository.UserRepository;
import com.homestay.infrastructure.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class AuthServiceImpl implements IAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Override
    public UserResponse registerUser(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String phone = request.getPhone().trim();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An account with this email address already exists."
            );
        }

        if (userRepository.existsByPhone(phone)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An account with this phone number already exists."
            );
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password and confirm password do not match."
            );
        }

        User user = new User();

        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Public registration always creates a normal user.
        user.setRole(Role.USER);
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);

        return mapToUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse loginUser(LoginRequest request) {
        return authenticateAccount(request, Role.USER);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse loginClient(LoginRequest request) {
        return authenticateAccount(request, Role.CLIENT);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse loginAdmin(LoginRequest request) {
        return authenticateAccount(request, Role.ADMIN);
    }

    private AuthResponse authenticateAccount(
            LoginRequest request,
            Role requiredRole
    ) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email address or password."
                ));

        validateAccountStatus(user);

        if (user.getRole() != requiredRole) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    getIncorrectPortalMessage(requiredRole)
            );
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            email,
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException exception) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email address or password."
            );
        }

        String token = jwtService.generateToken(user);

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setTokenType("Bearer");
        response.setUser(mapToUserResponse(user));

        return response;
    }

    private void validateAccountStatus(User user) {
        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Your account has been blocked. Please contact support."
            );
        }

        if (user.getStatus() == UserStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Your account is waiting for administrator approval."
            );
        }

        if (user.getStatus() == UserStatus.REJECTED) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Your account request was rejected."
            );
        }
    }

    private String getIncorrectPortalMessage(Role requiredRole) {
        return switch (requiredRole) {
            case USER -> "Please use the appropriate login portal for this account.";
            case CLIENT -> "This account does not have client access.";
            case ADMIN -> "This account does not have administrator access.";
        };
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