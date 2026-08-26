package com.pahadihaat.backend.controller;

import com.pahadihaat.backend.dto.order.OrderResponse;
import com.pahadihaat.backend.dto.order.PlaceOrderRequest;
import com.pahadihaat.backend.dto.order.TrackingResponse;
import com.pahadihaat.backend.model.User;
import com.pahadihaat.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse placeOrder(@AuthenticationPrincipal User user, @Valid @RequestBody PlaceOrderRequest req) {
        return orderService.placeOrder(user, req);
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrder(@AuthenticationPrincipal User user, @PathVariable String orderId) {
        return orderService.getOrder(user, orderId);
    }

    @GetMapping("/{orderId}/tracking")
    public TrackingResponse getTracking(@AuthenticationPrincipal User user, @PathVariable String orderId) {
        return orderService.getTracking(user, orderId);
    }
}
