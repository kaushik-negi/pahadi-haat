package com.pahadihaat.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginRequest {
    @NotBlank @Email
    private String email;

    @NotBlank
    private String password;

    // 'customer' | 'seller' | 'driver' — which role tab the user picked at login.
    @NotBlank
    private String role;
}
