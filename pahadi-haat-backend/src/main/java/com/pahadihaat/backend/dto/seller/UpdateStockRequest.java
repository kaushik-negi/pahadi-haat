package com.pahadihaat.backend.dto.seller;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateStockRequest {
    @NotNull @PositiveOrZero
    private Integer stock;
}
