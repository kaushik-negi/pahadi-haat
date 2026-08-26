package com.pahadihaat.backend.controller;

import com.pahadihaat.backend.dto.driver.DeliveryResponse;
import com.pahadihaat.backend.dto.driver.UpdateStatusRequest;
import com.pahadihaat.backend.model.User;
import com.pahadihaat.backend.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/driver")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping("/deliveries")
    public List<DeliveryResponse> getDeliveries(@AuthenticationPrincipal User user) {
        return driverService.getDeliveries(user);
    }

    @PutMapping("/deliveries/{orderId}/accept")
    public DeliveryResponse accept(@AuthenticationPrincipal User user, @PathVariable String orderId) {
        return driverService.acceptDelivery(user, orderId);
    }

    @PutMapping("/deliveries/{orderId}/status")
    public DeliveryResponse updateStatus(@AuthenticationPrincipal User user, @PathVariable String orderId,
                                          @Valid @RequestBody UpdateStatusRequest req) {
        return driverService.updateStatus(user, orderId, req.getStatus());
    }
}
