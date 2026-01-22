package com.wellness.marketplace.service;

import com.wellness.marketplace.model.AnalyticsLog;
import com.wellness.marketplace.model.AnalyticsMetric;
import com.wellness.marketplace.repository.AnalyticsLogRepository;
import com.wellness.marketplace.repository.AnalyticsMetricRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {
    
    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);
    
    @Autowired
    private AnalyticsLogRepository analyticsLogRepository;
    
    @Autowired
    private AnalyticsMetricRepository analyticsMetricRepository;
    
    /**
     * Log user action for analytics
     */
    public AnalyticsLog logAction(Long userId, String action, String category, String details, 
                                   String sourceAPI, String relatedEntityType, Long relatedEntityId,
                                   String status, String errorMessage) {
        AnalyticsLog log = new AnalyticsLog();
        log.setUserId(userId);
        log.setAction(action);
        log.setCategory(category);
        log.setDetails(details);
        log.setSourceAPI(sourceAPI);
        log.setRelatedEntityType(relatedEntityType);
        log.setRelatedEntityId(relatedEntityId);
        log.setTimestamp(LocalDateTime.now());
        log.setStatus(status != null ? status : "SUCCESS");
        log.setErrorMessage(errorMessage);
        
        logger.info("Logging action - User: {}, Action: {}, Category: {}", userId, action, category);
        
        return analyticsLogRepository.save(log);
    }
    
    /**
     * Get analytics for a specific user
     */
    public Map<String, Object> getUserAnalytics(Long userId) {
        List<AnalyticsLog> logs = analyticsLogRepository.findByUserId(userId);
        
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalActions", logs.size());
        analytics.put("recentLogs", logs.stream().limit(10).toList());
        
        return analytics;
    }
    
    /**
     * Get analytics for a date range
     */
    public Map<String, Object> getAnalyticsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<AnalyticsLog> logs = analyticsLogRepository.findByDateRange(startDate, endDate);
        
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalLogs", logs.size());
        analytics.put("dateRange", "From: " + startDate + " To: " + endDate);
        analytics.put("logs", logs);
        
        // Group by category
        Map<String, Long> categoryCount = new HashMap<>();
        logs.forEach(log -> {
            categoryCount.put(log.getCategory(), categoryCount.getOrDefault(log.getCategory(), 0L) + 1);
        });
        analytics.put("categoryBreakdown", categoryCount);
        
        return analytics;
    }
    
    /**
     * Record a metric
     */
    public AnalyticsMetric recordMetric(String metricName, Double metricValue, String timeFrame, 
                                        String category, String dimension) {
        AnalyticsMetric metric = new AnalyticsMetric();
        metric.setMetricName(metricName);
        metric.setMetricValue(metricValue);
        metric.setTimeFrame(timeFrame);
        metric.setAggregatedDate(LocalDateTime.now());
        metric.setCategory(category);
        metric.setDimension(dimension);
        metric.setCreatedAt(LocalDateTime.now());
        metric.setUpdatedAt(LocalDateTime.now());
        
        logger.info("Recording metric - Name: {}, Value: {}, Category: {}", metricName, metricValue, category);
        
        return analyticsMetricRepository.save(metric);
    }
    
    /**
     * Get metrics by category
     */
    public List<AnalyticsMetric> getMetricsByCategory(String category, LocalDateTime startDate, LocalDateTime endDate) {
        return analyticsMetricRepository.findByCategoryAndDateRange(category, startDate, endDate);
    }
    
    /**
     * Get aggregated metrics
     */
    public Map<String, Object> getAggregatedMetrics(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> aggregatedMetrics = new HashMap<>();
        
        // Total recommendations
        Double totalRecommendations = analyticsMetricRepository
            .sumMetricValueByNameAndDateRange("TOTAL_RECOMMENDATIONS", startDate, endDate);
        aggregatedMetrics.put("totalRecommendations", totalRecommendations != null ? totalRecommendations : 0);
        
        // Total bookings
        Double totalBookings = analyticsMetricRepository
            .sumMetricValueByNameAndDateRange("TOTAL_BOOKINGS", startDate, endDate);
        aggregatedMetrics.put("totalBookings", totalBookings != null ? totalBookings : 0);
        
        // Total sales
        Double totalSales = analyticsMetricRepository
            .sumMetricValueByNameAndDateRange("TOTAL_SALES", startDate, endDate);
        aggregatedMetrics.put("totalSales", totalSales != null ? totalSales : 0);
        
        // Total users
        Double totalUsers = analyticsMetricRepository
            .sumMetricValueByNameAndDateRange("TOTAL_USERS", startDate, endDate);
        aggregatedMetrics.put("totalUsers", totalUsers != null ? totalUsers : 0);
        
        return aggregatedMetrics;
    }
    
    /**
     * Get API performance metrics
     */
    public Map<String, Object> getAPIPerformanceMetrics() {
        List<AnalyticsLog> apiLogs = analyticsLogRepository.findByCategory("API");
        
        Map<String, Object> performance = new HashMap<>();
        performance.put("totalAPIRequests", apiLogs.size());
        
        long successCount = apiLogs.stream().filter(log -> "SUCCESS".equals(log.getStatus())).count();
        long failureCount = apiLogs.stream().filter(log -> "FAILURE".equals(log.getStatus())).count();
        
        performance.put("successfulRequests", successCount);
        performance.put("failedRequests", failureCount);
        performance.put("successRate", apiLogs.size() > 0 ? (successCount * 100.0 / apiLogs.size()) : 0);
        
        return performance;
    }
    
    /**
     * Delete old analytics logs (for cleanup)
     */
    public void deleteOldLogs(LocalDateTime beforeDate) {
        List<AnalyticsLog> oldLogs = analyticsLogRepository.findByDateRange(
            LocalDateTime.of(2000, 1, 1, 0, 0), 
            beforeDate
        );
        analyticsLogRepository.deleteAll(oldLogs);
        logger.info("Deleted {} old analytics logs", oldLogs.size());
    }
}
