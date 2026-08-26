package com.pahadihaat.backend.service;

import com.pahadihaat.backend.dto.driver.DeliveryResponse;
import com.pahadihaat.backend.exception.ApiException;
import com.pahadihaat.backend.model.Order;
import com.pahadihaat.backend.model.OrderStatus;
import com.pahadihaat.backend.model.User;
import com.pahadihaat.backend.repository.OrderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DriverService {

    private final OrderRepository orderRepository;

    public DriverService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /** Orders already assigned to this driver, plus unassigned open orders they could pick up. */
    public List<DeliveryResponse> getDeliveries(User driver) {
        List<Order> mine = orderRepository.findByAssignedDriverOrderByCreatedAtDesc(driver);
        List<Order> open = orderRepository.findByAssignedDriverIsNullAndStatusNot(OrderStatus.DELIVERED);

        List<DeliveryResponse> result = new ArrayList<>();
        mine.forEach(o -> result.add(toDto(o, true)));
        open.forEach(o -> result.add(toDto(o, false)));
        return result;
    }

    @Transactional
    public DeliveryResponse acceptDelivery(User driver, String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getAssignedDriver() != null && !order.getAssignedDriver().getId().equals(driver.getId())) {
            throw new ApiException(HttpStatus.CONFLICT, "This order is already assigned to another driver");
        }

        order.setAssignedDriver(driver);
        orderRepository.save(order);
        return toDto(order, true);
    }

    @Transactional
    public DeliveryResponse updateStatus(User driver, String orderCode, String statusStr) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getAssignedDriver() == null || !order.getAssignedDriver().getId().equals(driver.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "This delivery isn't assigned to you");
        }

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid status: " + statusStr);
        }
        if (newStatus == OrderStatus.PLACED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cannot revert a delivery back to PLACED");
        }

        order.setStatus(newStatus);
        orderRepository.save(order);
        return toDto(order, true);
    }

    private DeliveryResponse toDto(Order order, boolean assignedToMe) {
        return DeliveryResponse.builder()
                .orderId(order.getOrderCode())
                .customerName(order.getCustomer().getName())
                .address(order.getAddressLine() + ", " + order.getCity())
                .status(order.getStatus().name())
                .assignedToMe(assignedToMe)
                .build();
    }
}
