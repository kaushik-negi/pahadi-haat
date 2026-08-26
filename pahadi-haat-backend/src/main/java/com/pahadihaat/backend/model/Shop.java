package com.pahadihaat.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "shop")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nullable: demo/seeded shops have no logged-in owner.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", unique = true)
    private User owner;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Builder.Default
    private Double rating = 4.0;

    // Presentational only (e.g. "1.1 km away") — not a real geo computation.
    @Builder.Default
    private String distanceLabel = "Nearby";

    @Column(nullable = false, unique = true)
    private String shopCode;
}
