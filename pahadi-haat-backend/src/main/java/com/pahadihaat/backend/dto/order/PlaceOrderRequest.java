package com.pahadihaat.backend.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class PlaceOrderRequest {
    @NotBlank
    private String addressLine;
    @NotBlank
    private String city;
    @NotBlank
    private String postalCode;
    @NotBlank
    private String country;

    // cod | upi | card
    @NotBlank
    private String paymentMethod;

    @NotEmpty
    @Valid
    private List<OrderItemRequest> items;
}
