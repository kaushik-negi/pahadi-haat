package com.pahadihaat.backend.dto.seller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AddProductRequest {
    @NotBlank
    private String title;

    private String weight;

    @NotNull @Positive
    private Double price;

    private Double old;

    private Integer off;

    @NotBlank
    private String category;

    private String img;

    private Integer stock;
}
