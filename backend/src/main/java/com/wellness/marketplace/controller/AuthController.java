package com.wellness.marketplace.controller;

import com.wellness.marketplace.dto.AuthResponse;
import com.wellness.marketplace.dto.LoginRequest;
import com.wellness.marketplace.dto.RegisterRequest;
import com.wellness.marketplace.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String role,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) String documentType,
            @RequestParam(required = false) MultipartFile documentFile) {
        
        RegisterRequest request = new RegisterRequest();
        request.setName(name);
        request.setEmail(email);
        request.setPassword(password);
        request.setRole(role);
        request.setBio(bio != null ? bio : "");
        request.setDocumentType(documentType);
        request.setDocumentName(documentFile != null ? documentFile.getOriginalFilename() : null);
        
        return ResponseEntity.ok(authService.register(request, documentFile));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
