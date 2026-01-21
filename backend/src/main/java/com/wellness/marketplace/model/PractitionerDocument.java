package com.wellness.marketplace.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "practitioner_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PractitionerDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String documentName;

    @Column(nullable = false)
    private String documentPath;

    @Column(nullable = false)
    private String documentType; // e.g., "License", "Certification", "Degree"

    @Column(nullable = false)
    private String fileType; // e.g., "application/pdf", "image/jpeg"

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @Column
    private LocalDateTime verifiedAt;

    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED

    @Column
    private String rejectionReason;

    @PrePersist
    protected void onCreate() {
        if (this.uploadedAt == null) {
            this.uploadedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "PENDING";
        }
    }
}
