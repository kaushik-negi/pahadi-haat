package com.pahadihaat.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SellerRegisterRequest {
    @NotBlank
    private String fullName;

    @NotBlank
    private String phone;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank
    private String shopName;

    @NotBlank
    private String shopAddress;
}
