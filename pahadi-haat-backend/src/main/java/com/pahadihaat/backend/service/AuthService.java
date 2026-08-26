package com.pahadihaat.backend.service;

import com.pahadihaat.backend.dto.auth.*;
import com.pahadihaat.backend.exception.ApiException;
import com.pahadihaat.backend.model.DriverProfile;
import com.pahadihaat.backend.model.Role;
import com.pahadihaat.backend.model.Shop;
import com.pahadihaat.backend.model.User;
import com.pahadihaat.backend.repository.DriverProfileRepository;
import com.pahadihaat.backend.repository.ShopRepository;
import com.pahadihaat.backend.repository.UserRepository;
import com.pahadihaat.backend.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, ShopRepository shopRepository,
                        DriverProfileRepository driverProfileRepository,
                        PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.driverProfileRepository = driverProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse signupCustomer(SignupRequest req) {
        ensureEmailFree(req.getEmail());
        String fullName = (req.getFirstName() + " " + (req.getLastName() == null ? "" : req.getLastName())).trim();

        User user = User.builder()
                .name(fullName.isBlank() ? "Customer" : fullName)
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(Role.CUSTOMER)
                .build();
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse registerSeller(SellerRegisterRequest req) {
        ensureEmailFree(req.getEmail());

        User user = User.builder()
                .name(req.getFullName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(Role.SELLER)
                .build();
        userRepository.save(user);

        Shop shop = Shop.builder()
                .owner(user)
                .name(req.getShopName())
                .address(req.getShopAddress())
                .rating(4.0)
                .distanceLabel("Nearby")
                .shopCode(generateShopCode())
                .build();
        shopRepository.save(shop);

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse registerDriver(DriverRegisterRequest req) {
        ensureEmailFree(req.getEmail());

        User user = User.builder()
                .name(req.getFullName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(Role.DRIVER)
                .build();
        userRepository.save(user);

        DriverProfile profile = DriverProfile.builder()
                .user(user)
                .vehicleNumber(req.getVehicleNumber())
                .vehicleType(req.getVehicleType())
                .build();
        driverProfileRepository.save(profile);

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmailIgnoreCase(req.getEmail())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        if (!user.getRole().name().equalsIgnoreCase(req.getRole())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED,
                    "This account is registered as a " + user.getRole().name().toLowerCase() + ", not a " + req.getRole());
        }

        return buildAuthResponse(user);
    }

    private void ensureEmailFree(String email) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user.getEmail(), Map.of(
                "role", user.getRole().name(),
                "name", user.getName()
        ));
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name().toLowerCase())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    private String generateShopCode() {
        String code;
        do {
            code = "HOP" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        } while (shopRepository.existsByShopCode(code));
        return code;
    }
}
