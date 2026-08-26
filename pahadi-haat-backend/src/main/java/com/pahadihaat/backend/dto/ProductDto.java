package com.pahadihaat.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductDto {
    private Long id;
    private String title;
    private String weight;
    private Double price;
    private Double old;
    private Integer off;
    private Long shopId;
    private String shopName;
    private String category;
    private String img;
    private Integer stock;
}
