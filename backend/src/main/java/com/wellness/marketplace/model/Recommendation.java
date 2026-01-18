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
}
