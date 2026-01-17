package com.wellness.marketplace.controller;

import com.wellness.marketplace.model.TherapySession;
import com.wellness.marketplace.service.TherapySessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
//@CrossOrigin(origins = "*")
public class TherapySessionController {
    
    @Autowired
    private TherapySessionService sessionService;
    
    @PostMapping
    public ResponseEntity<TherapySession> bookSession(@RequestBody TherapySession session) {
        return ResponseEntity.ok(sessionService.bookSession(session));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TherapySession>> getUserSessions(@PathVariable Long userId) {
        return ResponseEntity.ok(sessionService.getUserSessions(userId));
    }
    
    @GetMapping("/practitioner/{practitionerId}")
    public ResponseEntity<List<TherapySession>> getPractitionerSessions(@PathVariable Long practitionerId) {
        return ResponseEntity.ok(sessionService.getPractitionerSessions(practitionerId));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<TherapySession> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(sessionService.updateSessionStatus(id, status));
    }
    
    @PutMapping("/{id}/notes")
    public ResponseEntity<TherapySession> addNotes(@PathVariable Long id, @RequestBody String notes) {
        return ResponseEntity.ok(sessionService.addNotes(id, notes));
    }
}
