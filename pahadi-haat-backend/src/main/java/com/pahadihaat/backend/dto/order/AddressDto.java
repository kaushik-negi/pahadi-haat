package com.pahadihaat.backend.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AddressDto {
    private String line;
    private String city;
    private String postal;
    private String country;
}
