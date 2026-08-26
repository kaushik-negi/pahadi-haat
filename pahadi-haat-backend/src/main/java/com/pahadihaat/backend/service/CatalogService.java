package com.pahadihaat.backend.service;

import com.pahadihaat.backend.dto.CategoryDto;
import com.pahadihaat.backend.dto.ProductDto;
import com.pahadihaat.backend.dto.ShopDto;
import com.pahadihaat.backend.exception.ApiException;
import com.pahadihaat.backend.model.Category;
import com.pahadihaat.backend.model.Product;
import com.pahadihaat.backend.model.Shop;
import com.pahadihaat.backend.repository.CategoryRepository;
import com.pahadihaat.backend.repository.ProductRepository;
import com.pahadihaat.backend.repository.ShopRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CatalogService {

    private final CategoryRepository categoryRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;

    public CatalogService(CategoryRepository categoryRepository, ShopRepository shopRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
    }

    public List<CategoryDto> getCategories() {
        return categoryRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<ShopDto> getShops() {
        return shopRepository.findAll().stream().map(this::toDto).toList();
    }

    public ShopDto getShop(Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Shop not found"));
        return toDto(shop);
    }

    public List<ProductDto> getProducts(String category, Long shopId) {
        List<Product> products;
        if (category != null && !category.isBlank()) {
            products = productRepository.findByCategory(category);
        } else if (shopId != null) {
            products = productRepository.findByShopId(shopId);
        } else {
            products = productRepository.findAll();
        }
        return products.stream().map(this::toDto).toList();
    }

    public ProductDto getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
        return toDto(product);
    }

    private CategoryDto toDto(Category c) {
        return CategoryDto.builder().slug(c.getSlug()).label(c.getLabel()).img(c.getImageUrl()).build();
    }

    private ShopDto toDto(Shop s) {
        return ShopDto.builder()
                .id(s.getId()).name(s.getName()).rating(s.getRating())
                .distance(s.getDistanceLabel()).address(s.getAddress()).shopId(s.getShopCode())
                .build();
    }

    private ProductDto toDto(Product p) {
        return ProductDto.builder()
                .id(p.getId()).title(p.getTitle()).weight(p.getWeight()).price(p.getPrice())
                .old(p.getOldPrice()).off(p.getDiscountPercent())
                .shopId(p.getShop().getId()).shopName(p.getShop().getName())
                .category(p.getCategory()).img(p.getImageUrl()).stock(p.getStockQty())
                .build();
    }
}
