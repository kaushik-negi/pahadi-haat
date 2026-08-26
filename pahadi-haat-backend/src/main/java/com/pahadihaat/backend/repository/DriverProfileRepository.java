package com.pahadihaat.backend.repository;

import com.pahadihaat.backend.model.DriverProfile;
import com.pahadihaat.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverProfileRepository extends JpaRepository<DriverProfile, Long> {
    Optional<DriverProfile> findByUser(User user);
}
