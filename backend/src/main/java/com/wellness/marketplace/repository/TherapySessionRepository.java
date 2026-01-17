package com.wellness.marketplace.repository;

import com.wellness.marketplace.model.TherapySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TherapySessionRepository extends JpaRepository<TherapySession, Long> {
    List<TherapySession> findByUserId(Long userId);
    List<TherapySession> findByPractitionerId(Long practitionerId);
    List<TherapySession> findByStatus(String status);
}
