package com.wellness.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionDTO {
    private Long id;
    private Long practitionerId;
    private String practitionerName;
    private String practitionerSpecialization;
    private Long userId;
    private LocalDateTime date;
    private String status;
    private String notes;
}
