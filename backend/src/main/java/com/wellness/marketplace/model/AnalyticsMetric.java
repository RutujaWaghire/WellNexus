package com.wellness.marketplace.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "analytics_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsMetric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String metricName; // e.g., "total_recommendations", "total_bookings", "total_sales"
    
    @Column(nullable = false)
    private Double metricValue;
    
    @Column
    private String timeFrame; // "DAILY", "WEEKLY", "MONTHLY", "YEARLY"
    
    @Column
    private LocalDateTime aggregatedDate;
    
    @Column
    private String category; // e.g., "RECOMMENDATIONS", "BOOKINGS", "SALES", "USERS"
    
    @Column
    private String dimension; // e.g., practitioner specialty, therapy type, etc.
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
