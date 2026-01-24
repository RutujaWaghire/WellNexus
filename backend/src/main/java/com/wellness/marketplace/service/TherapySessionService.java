package com.wellness.marketplace.service;

import com.wellness.marketplace.model.TherapySession;
import com.wellness.marketplace.repository.TherapySessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TherapySessionService {
    
    @Autowired
    private TherapySessionRepository sessionRepository;
    
    public TherapySession bookSession(TherapySession session) {
        session.setStatus("booked");
        return sessionRepository.save(session);
    }
    
    public List<TherapySession> getAllSessions() {
        return sessionRepository.findAll();
    }
    
    public List<TherapySession> getUserSessions(Long userId) {
        return sessionRepository.findByUserId(userId);
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
}
