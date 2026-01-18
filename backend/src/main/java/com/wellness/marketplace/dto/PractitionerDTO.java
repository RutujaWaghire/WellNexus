package com.wellness.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PractitionerDTO {
    private Long id;
    private Long userId;
    private String name;
    private String specialization;
    private Boolean verified;
    private Double rating;
}
