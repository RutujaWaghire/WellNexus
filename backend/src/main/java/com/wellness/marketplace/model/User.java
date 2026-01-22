package com.wellness.marketplace.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // patient, practitioner, or admin

    @Column(columnDefinition = "TEXT")
    private String bio;

    // Enhanced fields for commercial platform
    private String accountStatus; // PENDING, APPROVED, REJECTED

    private String specialization; // For practitioners

    private Double consultationFee; // For practitioners

    private LocalDateTime createdAt;

    private Boolean verified;
    
    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.accountStatus == null) {
            this.accountStatus = "PENDING";
        }
        if (this.verified == null) {
            this.verified = false;
        }
    }
}
