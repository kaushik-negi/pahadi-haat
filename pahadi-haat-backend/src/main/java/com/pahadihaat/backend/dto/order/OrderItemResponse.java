package com.pahadihaat.backend.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItemResponse {
    private Long productId;
    private String title;
    private String img;
    private String weight;
    private Integer qty;
    private Double price;
}
