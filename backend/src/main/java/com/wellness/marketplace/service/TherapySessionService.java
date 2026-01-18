package com.wellness.marketplace.service;

import com.wellness.marketplace.dto.SessionDTO;
import com.wellness.marketplace.model.TherapySession;
import com.wellness.marketplace.model.PractitionerProfile;
import com.wellness.marketplace.model.User;
import com.wellness.marketplace.repository.TherapySessionRepository;
import com.wellness.marketplace.repository.PractitionerProfileRepository;
import com.wellness.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TherapySessionService {
    
    @Autowired
    private TherapySessionRepository sessionRepository;
    
    @Autowired
    private PractitionerProfileRepository practitionerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public TherapySession bookSession(TherapySession session) {
        session.setStatus("booked");
        return sessionRepository.save(session);
    }
    
    public List<SessionDTO> getUserSessions(Long userId) {
        return sessionRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<TherapySession> getPractitionerSessions(Long practitionerId) {
        return sessionRepository.findByPractitionerId(practitionerId);
    }
    
    public TherapySession updateSessionStatus(Long id, String status) {
        TherapySession session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setStatus(status);
        return sessionRepository.save(session);
    }
    
    public TherapySession addNotes(Long id, String notes) {
        TherapySession session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setNotes(notes);
        return sessionRepository.save(session);
    }
    
    private SessionDTO convertToDTO(TherapySession session) {
        SessionDTO dto = new SessionDTO();
        dto.setId(session.getId());
        dto.setPractitionerId(session.getPractitionerId());
        dto.setUserId(session.getUserId());
        dto.setDate(session.getDate());
        dto.setStatus(session.getStatus());
        dto.setNotes(session.getNotes());
        
        // Fetch practitioner details
        PractitionerProfile practitioner = practitionerRepository.findById(session.getPractitionerId()).orElse(null);
        if (practitioner != null) {
            dto.setPractitionerSpecialization(practitioner.getSpecialization());
            
            // Fetch user name
            User user = userRepository.findById(practitioner.getUserId()).orElse(null);
            if (user != null) {
                dto.setPractitionerName(user.getName());
            }
        }
        
        return dto;
    }
}

