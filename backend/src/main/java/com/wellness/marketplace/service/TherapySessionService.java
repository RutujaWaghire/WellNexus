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
        System.out.println("Booking session for userId: " + session.getUserId() + ", practitionerId: " + session.getPractitionerId());
        session.setStatus("booked");
        TherapySession saved = sessionRepository.save(session);
        System.out.println("Session saved with id: " + saved.getId());
        return saved;
    }
    
    public List<TherapySession> getUserSessions(Long userId) {
        System.out.println("Fetching sessions for userId: " + userId);
        List<TherapySession> sessions = sessionRepository.findByUserId(userId);
        System.out.println("Found " + sessions.size() + " sessions for userId: " + userId);
        return sessions;
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
