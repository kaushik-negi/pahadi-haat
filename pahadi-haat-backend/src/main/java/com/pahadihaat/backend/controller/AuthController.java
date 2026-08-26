package com.pahadihaat.backend.controller;

import com.pahadihaat.backend.dto.auth.*;
import com.pahadihaat.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest req) {
        return ResponseEntity.ok(authService.signupCustomer(req));
    }

    @PostMapping("/seller/register")
    public ResponseEntity<AuthResponse> registerSeller(@Valid @RequestBody SellerRegisterRequest req) {
        return ResponseEntity.ok(authService.registerSeller(req));
    }

    @PostMapping("/driver/register")
    public ResponseEntity<AuthResponse> registerDriver(@Valid @RequestBody DriverRegisterRequest req) {
        return ResponseEntity.ok(authService.registerDriver(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
}
