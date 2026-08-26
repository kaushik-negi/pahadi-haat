package com.pahadihaat.backend.controller;

import com.pahadihaat.backend.dto.ProductDto;
import com.pahadihaat.backend.dto.seller.AddProductRequest;
import com.pahadihaat.backend.dto.seller.ShopSummaryDto;
import com.pahadihaat.backend.dto.seller.UpdateProductRequest;
import com.pahadihaat.backend.dto.seller.UpdateStockRequest;
import com.pahadihaat.backend.model.User;
import com.pahadihaat.backend.service.SellerService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller")
public class SellerController {

    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @GetMapping("/shop")
    public ShopSummaryDto getMyShop(@AuthenticationPrincipal User user) {
        return sellerService.getMyShop(user);
    }

    @GetMapping("/products")
    public List<ProductDto> getMyInventory(@AuthenticationPrincipal User user) {
        return sellerService.getMyInventory(user);
    }

    @PostMapping("/products")
    public ProductDto addProduct(@AuthenticationPrincipal User user, @Valid @RequestBody AddProductRequest req) {
        return sellerService.addProduct(user, req);
    }

    @PutMapping("/products/{id}")
    public ProductDto updateProduct(@AuthenticationPrincipal User user, @PathVariable Long id,
                                     @RequestBody UpdateProductRequest req) {
        return sellerService.updateProduct(user, id, req);
    }

    @PutMapping("/products/{id}/stock")
    public ProductDto updateStock(@AuthenticationPrincipal User user, @PathVariable Long id,
                                   @Valid @RequestBody UpdateStockRequest req) {
        return sellerService.updateStock(user, id, req.getStock());
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@AuthenticationPrincipal User user, @PathVariable Long id) {
        sellerService.deleteProduct(user, id);
    }
}
