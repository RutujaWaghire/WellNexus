package com.wellness.marketplace.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "api_integrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class APIIntegration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String apiName; // "OpenFDA", "WHO", "FITNESS_API"
    
    @Column(nullable = false)
    private String apiEndpoint;
    
    @Column
    private String apiKey;
    
    @Column(nullable = false)
    private Boolean isActive;
    
    @Column
    private Long requestCount;
    
    @Column
    private Long successCount;
    
    @Column
    private Long errorCount;
    
    @Column
    private LocalDateTime lastSyncTime;
    
    @Column
    private LocalDateTime lastErrorTime;
    
    @Column
    private String lastErrorMessage;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
