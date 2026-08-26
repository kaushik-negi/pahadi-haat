package com.pahadihaat.backend.repository;

import com.pahadihaat.backend.model.Shop;
import com.pahadihaat.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findByOwner(User owner);
    boolean existsByShopCode(String shopCode);
}
