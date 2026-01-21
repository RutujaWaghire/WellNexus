package com.wellness.marketplace.service;

import com.wellness.marketplace.dto.AuthResponse;
import com.wellness.marketplace.dto.LoginRequest;
import com.wellness.marketplace.dto.RegisterRequest;
import com.wellness.marketplace.model.User;
import com.wellness.marketplace.repository.UserRepository;
import com.wellness.marketplace.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private PractitionerDocumentService documentService;
    
    public AuthResponse register(RegisterRequest request, MultipartFile documentFile) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setBio(request.getBio() != null ? request.getBio() : "");
        user.setAccountStatus("PENDING");
        user.setVerified(false);
        user.setCreatedAt(java.time.LocalDateTime.now());
        
        user = userRepository.save(user);
        
        // Handle document upload for practitioners
        if ("practitioner".equals(request.getRole()) && documentFile != null && !documentFile.isEmpty()) {
            try {
                documentService.uploadDocument(user.getId(), request.getDocumentType(), documentFile);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload document: " + e.getMessage());
            }
        }
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        
        return new AuthResponse(token, refreshToken, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        
        return new AuthResponse(token, refreshToken, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
