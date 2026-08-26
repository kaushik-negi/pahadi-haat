package com.pahadihaat.backend.dto.seller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ShopSummaryDto {
    private Long id;
    private String name;
    private String address;
    private String shopId;
    private Double rating;
}
