package com.wellness.marketplace.service;

import com.wellness.marketplace.dto.UnverifiedPractitionerDTO;
import com.wellness.marketplace.dto.PractitionerVerifyRequest;
import com.wellness.marketplace.dto.PractitionerProfileDTO;
import com.wellness.marketplace.model.PractitionerProfile;
import com.wellness.marketplace.model.User;
import com.wellness.marketplace.repository.PractitionerProfileRepository;
import com.wellness.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PractitionerService {
    
    @Autowired
    private PractitionerProfileRepository practitionerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public PractitionerProfile createProfile(PractitionerProfile profile) {
        return practitionerRepository.save(profile);
    }
    
    public PractitionerProfile getProfileByUserId(Long userId) {
        return practitionerRepository.findByUserId(userId)
                .orElse(null);
    }
    
    public List<PractitionerProfileDTO> getAllPractitioners() {
        return practitionerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PractitionerProfileDTO> getVerifiedPractitioners() {
        return practitionerRepository.findByVerified(true).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PractitionerProfileDTO> getPractitionersBySpecialization(String specialization) {
        return practitionerRepository.findBySpecialization(specialization).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public PractitionerProfile verifyPractitioner(Long id) {
        PractitionerProfile profile = practitionerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practitioner not found"));
        profile.setVerified(true);
        return practitionerRepository.save(profile);
    }
    
    public PractitionerProfile updateRating(Long id, Double rating) {
        PractitionerProfile profile = practitionerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practitioner not found"));
        profile.setRating(rating);
        return practitionerRepository.save(profile);
    }
    
    public List<UnverifiedPractitionerDTO> getUnverifiedPractitioners() {
        // Get all users with practitioner role
        List<User> allPractitioners = userRepository.findByRole("practitioner");
        
        // Get all user IDs that already have profiles
        List<Long> verifiedUserIds = practitionerRepository.findAll()
                .stream()
                .map(PractitionerProfile::getUserId)
                .collect(Collectors.toList());
        
        // Filter to get only those without profiles
        return allPractitioners.stream()
                .filter(user -> !verifiedUserIds.contains(user.getId()))
                .map(user -> new UnverifiedPractitionerDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getBio()
                ))
                .collect(Collectors.toList());
    }
    
    public PractitionerProfile adminVerifyPractitioner(PractitionerVerifyRequest request) {
        // Check if user exists and is a practitioner
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!"practitioner".equals(user.getRole())) {
            throw new RuntimeException("User is not a practitioner");
        }
        
        // Check if profile already exists
        if (practitionerRepository.findByUserId(request.getUserId()).isPresent()) {
            throw new RuntimeException("Practitioner profile already exists");
        }
        
        // Create new practitioner profile
        PractitionerProfile profile = new PractitionerProfile();
        profile.setUserId(request.getUserId());
        profile.setSpecialization(request.getSpecialization());
        profile.setRating(request.getRating() != null ? request.getRating() : 0.0);
        profile.setVerified(true); // Verified by admin during creation
        
        return practitionerRepository.save(profile);
    }
    
    private PractitionerProfileDTO convertToDTO(PractitionerProfile profile) {
        User user = userRepository.findById(profile.getUserId())
                .orElse(null);
        
        PractitionerProfileDTO dto = new PractitionerProfileDTO();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUserId());
        dto.setName(user != null ? user.getName() : "Unknown");
        dto.setSpecialization(profile.getSpecialization());
        dto.setVerified(profile.getVerified());
        dto.setRating(profile.getRating());
        dto.setConsultationFee(profile.getConsultationFee());
        dto.setBio(user != null ? user.getBio() : "");
        
        return dto;
    }
}
