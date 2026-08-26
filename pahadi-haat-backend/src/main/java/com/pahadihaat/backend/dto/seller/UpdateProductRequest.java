package com.pahadihaat.backend.dto.seller;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateProductRequest {
    private String title;
    private String weight;
    private Double price;
    private Double old;
    private Integer off;
    private String category;
    private String img;
}
