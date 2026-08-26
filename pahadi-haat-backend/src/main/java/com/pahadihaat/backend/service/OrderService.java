package com.pahadihaat.backend.service;

import com.pahadihaat.backend.dto.order.*;
import com.pahadihaat.backend.exception.ApiException;
import com.pahadihaat.backend.model.*;
import com.pahadihaat.backend.repository.OrderRepository;
import com.pahadihaat.backend.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class OrderService {

    private static final double DELIVERY_FEE = 4.0;

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderResponse placeOrder(User customer, PlaceOrderRequest req) {
        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cart is empty");
        }

        List<OrderItem> items = new ArrayList<>();
        double subtotal = 0;

        for (OrderItemRequest line : req.getItems()) {
            Product product = productRepository.findById(line.getProductId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product " + line.getProductId() + " not found"));

            int qty = line.getQty() == null ? 1 : line.getQty();
            // Prices are always taken from the database, never trusted from the client.
            double lineTotal = product.getPrice() * qty;
            subtotal += lineTotal;

            items.add(OrderItem.builder()
                    .product(product)
                    .title(product.getTitle())
                    .imageUrl(product.getImageUrl())
                    .weight(product.getWeight())
                    .quantity(qty)
                    .unitPrice(product.getPrice())
                    .build());
        }

        double deliveryFee = DELIVERY_FEE;
        double total = subtotal + deliveryFee;

        Order order = Order.builder()
                .orderCode(generateOrderCode())
                .customer(customer)
                .addressLine(req.getAddressLine())
                .city(req.getCity())
                .postalCode(req.getPostalCode())
                .country(req.getCountry())
                .paymentMethod(req.getPaymentMethod())
                .subtotal(subtotal)
                .deliveryFee(deliveryFee)
                .total(total)
                .status(OrderStatus.PLACED)
                .build();

        items.forEach(item -> item.setOrder(order));
        order.setItems(items);

        orderRepository.save(order);

        return toResponse(order);
    }

    public OrderResponse getOrder(User requester, String orderCode) {
        Order order = findOwnedOrder(requester, orderCode);
        return toResponse(order);
    }

    public TrackingResponse getTracking(User requester, String orderCode) {
        Order order = findOwnedOrder(requester, orderCode);

        boolean placed = true;
        boolean shipped = order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED;
        boolean delivered = order.getStatus() == OrderStatus.DELIVERED;

        return TrackingResponse.builder()
                .orderId(order.getOrderCode())
                .status(order.getStatus().name())
                .steps(List.of(
                        TrackingStepDto.builder().label("Order Placed").done(placed).build(),
                        TrackingStepDto.builder().label("Shipped").done(shipped).build(),
                        TrackingStepDto.builder().label("Delivered").done(delivered).build()
                ))
                .build();
    }

    private Order findOwnedOrder(User requester, String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));

        boolean isOwner = order.getCustomer().getId().equals(requester.getId());
        boolean isAssignedDriver = order.getAssignedDriver() != null && order.getAssignedDriver().getId().equals(requester.getId());

        if (!isOwner && !isAssignedDriver && requester.getRole() != Role.DRIVER) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You don't have access to this order");
        }
        return order;
    }

    private String generateOrderCode() {
        String code;
        do {
            code = "PH" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        } while (orderRepository.existsByOrderCode(code));
        return code;
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> lines = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                        .title(item.getTitle())
                        .img(item.getImageUrl())
                        .weight(item.getWeight())
                        .qty(item.getQuantity())
                        .price(item.getUnitPrice())
                        .build())
                .toList();

        AddressDto address = AddressDto.builder()
                .line(order.getAddressLine()).city(order.getCity())
                .postal(order.getPostalCode()).country(order.getCountry())
                .build();

        return OrderResponse.builder()
                .orderId(order.getOrderCode())
                .status(order.getStatus().name())
                .lines(lines)
                .subtotal(order.getSubtotal())
                .deliveryFee(order.getDeliveryFee())
                .total(order.getTotal())
                .address(address)
                .payment(order.getPaymentMethod())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
