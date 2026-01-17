package com.wellness.marketplace.service;

import com.wellness.marketplace.dto.UnverifiedPractitionerDTO;
import com.wellness.marketplace.dto.PractitionerVerifyRequest;
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
    
    public List<PractitionerProfile> getAllPractitioners() {
        return practitionerRepository.findAll();
    }
    
    public List<PractitionerProfile> getVerifiedPractitioners() {
        return practitionerRepository.findByVerified(true);
    }
    
    public List<PractitionerProfile> getPractitionersBySpecialization(String specialization) {
        return practitionerRepository.findBySpecialization(specialization);
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
}
