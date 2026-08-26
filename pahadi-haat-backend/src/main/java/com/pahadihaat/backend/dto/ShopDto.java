package com.pahadihaat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ShopDto {
    private Long id;
    private String name;
    private Double rating;
    private String distance;
    private String address;
    private String shopId; // shopCode
}
