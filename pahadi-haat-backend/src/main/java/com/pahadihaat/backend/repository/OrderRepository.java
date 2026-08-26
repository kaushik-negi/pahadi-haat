package com.pahadihaat.backend.repository;

import com.pahadihaat.backend.model.Order;
import com.pahadihaat.backend.model.OrderStatus;
import com.pahadihaat.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderCode(String orderCode);
    boolean existsByOrderCode(String orderCode);
    List<Order> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Order> findByAssignedDriverOrderByCreatedAtDesc(User driver);
    List<Order> findByAssignedDriverIsNullAndStatusNot(OrderStatus status);
}
