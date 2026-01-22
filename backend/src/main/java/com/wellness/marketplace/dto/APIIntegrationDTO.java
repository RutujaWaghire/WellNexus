package com.wellness.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class APIIntegrationDTO {
    private Long id;
    private String apiName;
    private String apiEndpoint;
    private Boolean isActive;
    private Long requestCount;
    private Long successCount;
    private Long errorCount;
    private LocalDateTime lastSyncTime;
    private LocalDateTime lastErrorTime;
    private String lastErrorMessage;
}
