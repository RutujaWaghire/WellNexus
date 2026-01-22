package com.wellness.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsLogDTO {
    private Long id;
    private Long userId;
    private String action;
    private String category;
    private String details;
    private String sourceAPI;
    private String relatedEntityType;
    private Long relatedEntityId;
    private LocalDateTime timestamp;
    private String status;
    private String errorMessage;
}
