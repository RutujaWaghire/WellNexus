package com.wellness.marketplace.controller;

import com.wellness.marketplace.dto.UnverifiedPractitionerDTO;
import com.wellness.marketplace.dto.PractitionerVerifyRequest;
import com.wellness.marketplace.dto.PractitionerProfileDTO;
import com.wellness.marketplace.model.PractitionerProfile;
import com.wellness.marketplace.service.PractitionerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/practitioners")
//@CrossOrigin(origins = "*")
public class PractitionerController {
    
    @Autowired
    private PractitionerService practitionerService;
    
    @PostMapping
    public ResponseEntity<PractitionerProfile> createProfile(@RequestBody PractitionerProfile profile) {
        return ResponseEntity.ok(practitionerService.createProfile(profile));
    }
    
    @GetMapping
    public ResponseEntity<List<PractitionerProfileDTO>> getAllPractitioners() {
        return ResponseEntity.ok(practitionerService.getAllPractitioners());
    }
    
    @GetMapping("/verified")
    public ResponseEntity<List<PractitionerProfileDTO>> getVerifiedPractitioners() {
        return ResponseEntity.ok(practitionerService.getVerifiedPractitioners());
    }
    
    @GetMapping("/unverified")
    public ResponseEntity<List<UnverifiedPractitionerDTO>> getUnverifiedPractitioners() {
        return ResponseEntity.ok(practitionerService.getUnverifiedPractitioners());
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<PractitionerProfile> getProfileByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(practitionerService.getProfileByUserId(userId));
    }
    
    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<PractitionerProfileDTO>> getPractitionersBySpecialization(@PathVariable String specialization) {
        return ResponseEntity.ok(practitionerService.getPractitionersBySpecialization(specialization));
    }
    
    @PutMapping("/{id}/verify")
    public ResponseEntity<PractitionerProfile> verifyPractitioner(@PathVariable Long id) {
        return ResponseEntity.ok(practitionerService.verifyPractitioner(id));
    }
    
    @PostMapping("/admin/verify")
    public ResponseEntity<PractitionerProfile> adminVerifyPractitioner(@RequestBody PractitionerVerifyRequest request) {
        return ResponseEntity.ok(practitionerService.adminVerifyPractitioner(request));
    }
    
    @PutMapping("/{id}/rating")
    public ResponseEntity<PractitionerProfile> updateRating(@PathVariable Long id, @RequestParam Double rating) {
        return ResponseEntity.ok(practitionerService.updateRating(id, rating));
    }
}
