package com.wellness.marketplace.repository;

import com.wellness.marketplace.model.AnalyticsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnalyticsLogRepository extends JpaRepository<AnalyticsLog, Long> {
    List<AnalyticsLog> findByUserId(Long userId);
    
    List<AnalyticsLog> findByAction(String action);
    
    List<AnalyticsLog> findByCategory(String category);
    
    List<AnalyticsLog> findByStatus(String status);
    
    List<AnalyticsLog> findBySourceAPI(String sourceAPI);
    
    @Query("SELECT a FROM AnalyticsLog a WHERE a.userId = :userId AND a.timestamp BETWEEN :startDate AND :endDate")
    List<AnalyticsLog> findByUserIdAndDateRange(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM AnalyticsLog a WHERE a.timestamp BETWEEN :startDate AND :endDate")
    List<AnalyticsLog> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(a) FROM AnalyticsLog a WHERE a.category = :category AND a.timestamp BETWEEN :startDate AND :endDate")
    Long countByCategory(@Param("category") String category, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
