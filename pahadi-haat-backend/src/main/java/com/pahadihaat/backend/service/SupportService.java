package com.pahadihaat.backend.service;

import com.pahadihaat.backend.dto.support.ContactRequest;
import com.pahadihaat.backend.model.ContactMessage;
import com.pahadihaat.backend.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

@Service
public class SupportService {
    private final ContactMessageRepository contactMessageRepository;

    public SupportService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public void saveContactMessage(ContactRequest request) {
        contactMessageRepository.save(ContactMessage.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .topic(request.getTopic().trim())
                .message(request.getMessage().trim())
                .build());
    }
}
