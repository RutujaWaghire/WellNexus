package com.wellness.marketplace.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "analytics_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private String action; // e.g., "RECOMMENDATION_VIEWED", "SESSION_BOOKED", "PRODUCT_PURCHASED"
    
    @Column(nullable = false)
    private String category; // e.g., "RECOMMENDATION", "BOOKING", "PURCHASE"
    
    @Column(columnDefinition = "TEXT")
    private String details; // JSON or detailed description
    
    @Column
    private String sourceAPI; // e.g., "OpenFDA", "WHO", "FITNESS_API", "AI_ENGINE"
    
    @Column
    private String relatedEntityType; // e.g., "Practitioner", "Product", "Session"
    
    @Column
    private Long relatedEntityId;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column(nullable = false)
    private String status; // "SUCCESS", "FAILURE", "PENDING"
    
    @Column
    private String errorMessage;
}
