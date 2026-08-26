package com.pahadihaat.backend.dto.support;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ContactRequest {
    @NotBlank @Size(max = 120) private String name;
    @NotBlank @Email @Size(max = 254) private String email;
    @NotBlank @Size(max = 40) private String topic;
    @NotBlank @Size(max = 4000) private String message;
}
