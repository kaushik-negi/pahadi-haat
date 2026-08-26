package com.pahadihaat.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String weight;

    @Column(nullable = false)
    private Double price;

    // Original ("struck through") price before discount, nullable.
    private Double oldPrice;

    // Discount percentage, nullable.
    private Integer discountPercent;

    // Matches a Category.slug
    @Column(nullable = false)
    private String category;

    private String imageUrl;

    @Builder.Default
    private Integer stockQty = 25;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;
}
