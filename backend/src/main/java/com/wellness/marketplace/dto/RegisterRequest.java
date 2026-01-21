package com.wellness.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role; // patient or practitioner
    private String bio;
    
    // For practitioner document upload
    private String documentType; // e.g., "License", "Certification", "Degree"
    private String documentName; // e.g., "Medical License"
    // Note: File handling will be done separately in multipart form-data
}
