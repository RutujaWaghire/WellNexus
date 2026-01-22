package com.wellness.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnverifiedPractitionerDTO {
    private Long userId;
    private String name;
    private String email;
    private String bio;
}
