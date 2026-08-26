package com.pahadihaat.backend.controller;

import com.pahadihaat.backend.dto.CategoryDto;
import com.pahadihaat.backend.dto.ProductDto;
import com.pahadihaat.backend.dto.ShopDto;
import com.pahadihaat.backend.service.CatalogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/categories")
    public List<CategoryDto> getCategories() {
        return catalogService.getCategories();
    }

    @GetMapping("/shops")
    public List<ShopDto> getShops() {
        return catalogService.getShops();
    }

    @GetMapping("/shops/{id}")
    public ShopDto getShop(@PathVariable Long id) {
        return catalogService.getShop(id);
    }

    @GetMapping("/products")
    public List<ProductDto> getProducts(@RequestParam(required = false) String category,
                                         @RequestParam(required = false) Long shopId) {
        return catalogService.getProducts(category, shopId);
    }

    @GetMapping("/products/{id}")
    public ProductDto getProduct(@PathVariable Long id) {
        return catalogService.getProduct(id);
    }
}
