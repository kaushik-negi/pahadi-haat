package com.pahadihaat.backend.repository;

import com.pahadihaat.backend.model.Product;
import com.pahadihaat.backend.model.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByShopId(Long shopId);
    List<Product> findByShop(Shop shop);
}
