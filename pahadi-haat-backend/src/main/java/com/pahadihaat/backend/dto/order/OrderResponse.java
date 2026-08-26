package com.pahadihaat.backend.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderResponse {
    private String orderId; // orderCode
    private String status;
    private List<OrderItemResponse> lines;
    private Double subtotal;
    private Double deliveryFee;
    private Double total;
    private AddressDto address;
    private String payment;
    private Instant createdAt;
}
