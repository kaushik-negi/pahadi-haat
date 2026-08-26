package com.pahadihaat.backend.service;

import com.pahadihaat.backend.dto.ProductDto;
import com.pahadihaat.backend.dto.seller.AddProductRequest;
import com.pahadihaat.backend.dto.seller.ShopSummaryDto;
import com.pahadihaat.backend.dto.seller.UpdateProductRequest;
import com.pahadihaat.backend.exception.ApiException;
import com.pahadihaat.backend.model.Product;
import com.pahadihaat.backend.model.Shop;
import com.pahadihaat.backend.model.User;
import com.pahadihaat.backend.repository.ProductRepository;
import com.pahadihaat.backend.repository.ShopRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class SellerService {

    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;

    public SellerService(ShopRepository shopRepository, ProductRepository productRepository) {
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
    }

    public ShopSummaryDto getMyShop(User seller) {
        Shop shop = requireShop(seller);
        return ShopSummaryDto.builder()
                .id(shop.getId()).name(shop.getName()).address(shop.getAddress())
                .shopId(shop.getShopCode()).rating(shop.getRating())
                .build();
    }

    public List<ProductDto> getMyInventory(User seller) {
        Shop shop = requireShop(seller);
        return productRepository.findByShop(shop).stream().map(this::toDto).toList();
    }

    @Transactional
    public ProductDto addProduct(User seller, AddProductRequest req) {
        Shop shop = requireShop(seller);

        Product product = Product.builder()
                .title(req.getTitle())
                .weight(req.getWeight())
                .price(req.getPrice())
                .oldPrice(req.getOld())
                .discountPercent(req.getOff())
                .category(req.getCategory())
                .imageUrl(req.getImg())
                .stockQty(req.getStock() == null ? 25 : req.getStock())
                .shop(shop)
                .build();

        productRepository.save(product);
        return toDto(product);
    }

    @Transactional
    public ProductDto updateProduct(User seller, Long productId, UpdateProductRequest req) {
        Product product = requireOwnedProduct(seller, productId);

        if (req.getTitle() != null) product.setTitle(req.getTitle());
        if (req.getWeight() != null) product.setWeight(req.getWeight());
        if (req.getPrice() != null) product.setPrice(req.getPrice());
        if (req.getOld() != null) product.setOldPrice(req.getOld());
        if (req.getOff() != null) product.setDiscountPercent(req.getOff());
        if (req.getCategory() != null) product.setCategory(req.getCategory());
        if (req.getImg() != null) product.setImageUrl(req.getImg());

        productRepository.save(product);
        return toDto(product);
    }

    @Transactional
    public ProductDto updateStock(User seller, Long productId, int stock) {
        Product product = requireOwnedProduct(seller, productId);
        product.setStockQty(Math.max(0, stock));
        productRepository.save(product);
        return toDto(product);
    }

    @Transactional
    public void deleteProduct(User seller, Long productId) {
        Product product = requireOwnedProduct(seller, productId);
        productRepository.delete(product);
    }

    private Shop requireShop(User seller) {
        return shopRepository.findByOwner(seller)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "No shop found for this seller account"));
    }

    private Product requireOwnedProduct(User seller, Long productId) {
        Shop shop = requireShop(seller);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
        if (!product.getShop().getId().equals(shop.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "This product doesn't belong to your shop");
        }
        return product;
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
