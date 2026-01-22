package com.wellness.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PractitionerVerifyRequest {
    private Long userId;
    private String specialization;
    private Double rating;
}
