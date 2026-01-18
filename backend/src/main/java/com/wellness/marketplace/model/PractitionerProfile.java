package com.wellness.marketplace.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "practitioner_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PractitionerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private String specialization;
    
    @Column(nullable = false)
    private Boolean verified = false;
    
    @Column
    private Double rating = 0.0;
}
