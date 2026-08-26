package com.pahadihaat.backend.dto.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OrderItemRequest {
    @NotNull
    private Long productId;

    @Min(1)
    private Integer qty;
}
