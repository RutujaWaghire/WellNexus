package com.wellness.marketplace.repository;

import com.wellness.marketplace.model.AnalyticsMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnalyticsMetricRepository extends JpaRepository<AnalyticsMetric, Long> {
    List<AnalyticsMetric> findByMetricName(String metricName);
    
    List<AnalyticsMetric> findByCategory(String category);
    
    List<AnalyticsMetric> findByTimeFrame(String timeFrame);
    
    Optional<AnalyticsMetric> findByMetricNameAndAggregatedDate(String metricName, LocalDateTime aggregatedDate);
    
    @Query("SELECT am FROM AnalyticsMetric am WHERE am.category = :category AND am.aggregatedDate BETWEEN :startDate AND :endDate")
    List<AnalyticsMetric> findByCategoryAndDateRange(@Param("category") String category, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(am.metricValue) FROM AnalyticsMetric am WHERE am.metricName = :metricName AND am.aggregatedDate BETWEEN :startDate AND :endDate")
    Double sumMetricValueByNameAndDateRange(@Param("metricName") String metricName, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
