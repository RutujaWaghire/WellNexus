package com.wellness.marketplace.repository;

import com.wellness.marketplace.model.PractitionerDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PractitionerDocumentRepository extends JpaRepository<PractitionerDocument, Long> {
    List<PractitionerDocument> findByUserId(Long userId);
    List<PractitionerDocument> findByStatus(String status);
    List<PractitionerDocument> findByUserIdAndStatus(Long userId, String status);
}
