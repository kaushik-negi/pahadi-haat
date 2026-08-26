package com.pahadihaat.backend.controller;

import com.pahadihaat.backend.dto.support.ContactRequest;
import com.pahadihaat.backend.dto.support.ContactResponse;
import com.pahadihaat.backend.service.SupportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
public class SupportController {
    private final SupportService supportService;

    public SupportController(SupportService supportService) { this.supportService = supportService; }

    @PostMapping("/contact")
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse contact(@Valid @RequestBody ContactRequest request) {
        supportService.saveContactMessage(request);
        return new ContactResponse("Thanks for your message. Our support team will respond as soon as possible.");
    }
}
