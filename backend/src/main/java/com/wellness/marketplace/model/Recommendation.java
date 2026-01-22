package com.wellness.marketplace.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String symptom;
    
    @Column(nullable = false)
    private String suggestedTherapy;
    
    @Column
    private String sourceAPI;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    // External API enriched data
    @Column(columnDefinition = "TEXT")
    private String fdaDrugInfo; // JSON data from OpenFDA
    
    @Column(columnDefinition = "TEXT")
    private String whoGuidelines; // JSON data from WHO
    
    @Column(columnDefinition = "TEXT")
    private String fitnessData; // JSON data from Fitness API
    
    @Column(columnDefinition = "TEXT")
    private String enrichedDescription; // Human-readable enriched recommendation
    
    @Column
    private String confidenceLevel; // HIGH, MEDIUM, LOW
}
