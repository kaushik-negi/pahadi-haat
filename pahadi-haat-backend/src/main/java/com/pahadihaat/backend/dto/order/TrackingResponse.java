package com.pahadihaat.backend.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TrackingResponse {
    private String orderId;
    private String status;
    private List<TrackingStepDto> steps;
}
