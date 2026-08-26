package com.pahadihaat.backend.dto.driver;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryResponse {
    private String orderId;
    private String customerName;
    private String address;
    private String status;
    private boolean assignedToMe;
}
