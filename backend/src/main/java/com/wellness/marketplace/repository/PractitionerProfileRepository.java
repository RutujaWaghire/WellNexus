package com.wellness.marketplace.repository;

import com.wellness.marketplace.model.PractitionerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PractitionerProfileRepository extends JpaRepository<PractitionerProfile, Long> {
    Optional<PractitionerProfile> findByUserId(Long userId);
    List<PractitionerProfile> findByVerified(Boolean verified);
    List<PractitionerProfile> findBySpecialization(String specialization);
}
