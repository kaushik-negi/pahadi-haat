package com.pahadihaat.backend.dto.driver;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateStatusRequest {
    // SHIPPED | DELIVERED
    @NotBlank
    private String status;
}
