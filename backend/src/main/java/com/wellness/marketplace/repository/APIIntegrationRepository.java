package com.wellness.marketplace.repository;

import com.wellness.marketplace.model.APIIntegration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface APIIntegrationRepository extends JpaRepository<APIIntegration, Long> {
    Optional<APIIntegration> findByApiName(String apiName);
    
    Optional<APIIntegration> findByApiNameAndIsActiveTrue(String apiName);
}
