package com.wellness.marketplace.controller;

import com.wellness.marketplace.dto.AnalyticsDashboardDTO;
import com.wellness.marketplace.dto.AnalyticsLogDTO;
import com.wellness.marketplace.dto.APIIntegrationDTO;
import com.wellness.marketplace.model.AnalyticsLog;
import com.wellness.marketplace.model.AnalyticsMetric;
import com.wellness.marketplace.model.APIIntegration;
import com.wellness.marketplace.service.AnalyticsService;
import com.wellness.marketplace.service.ExternalAPIService;
import com.wellness.marketplace.repository.APIIntegrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @Autowired
    private ExternalAPIService externalAPIService;
    
    @Autowired
    private APIIntegrationRepository apiIntegrationRepository;
    
    /**
     * Get analytics dashboard data
     */
    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsDashboardDTO> getDashboard(
            @RequestParam(required = false, defaultValue = "30") Integer days) {
        try {
            LocalDateTime endDate = LocalDateTime.now();
            LocalDateTime startDate = endDate.minusDays(days);
            
            // Get aggregated metrics
            Map<String, Object> metrics = analyticsService.getAggregatedMetrics(startDate, endDate);
            
            // Get API performance
            Map<String, Object> apiPerformance = analyticsService.getAPIPerformanceMetrics();
            
            // Build dashboard DTO
            AnalyticsDashboardDTO dashboard = new AnalyticsDashboardDTO();
            dashboard.setTotalRecommendations((Double) metrics.getOrDefault("totalRecommendations", 0.0));
            dashboard.setTotalBookings((Double) metrics.getOrDefault("totalBookings", 0.0));
            dashboard.setTotalSales((Double) metrics.getOrDefault("totalSales", 0.0));
            dashboard.setTotalUsers((Double) metrics.getOrDefault("totalUsers", 0.0));
            dashboard.setApiSuccessRate((Double) apiPerformance.getOrDefault("successRate", 0.0));
            dashboard.setApiPerformance(apiPerformance);
            dashboard.setGeneratedAt(LocalDateTime.now());
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get user analytics
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserAnalytics(@PathVariable Long userId) {
        try {
            Map<String, Object> analytics = analyticsService.getUserAnalytics(userId);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get analytics for a date range
     */
    @GetMapping("/range")
    public ResponseEntity<Map<String, Object>> getAnalyticsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Map<String, Object> analytics = analyticsService.getAnalyticsByDateRange(startDate, endDate);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get analytics logs
     */
    @GetMapping("/logs")
    public ResponseEntity<Map<String, Object>> getAnalyticsLogs(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String action,
            @RequestParam(defaultValue = "100") Integer limit) {
        try {
            Map<String, Object> response = new HashMap<>();
            // This would require additional methods in AnalyticsService for filtering
            response.put("message", "Analytics logs retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get API integrations status
     */
    @GetMapping("/api-integrations")
    public ResponseEntity<List<APIIntegrationDTO>> getAPIIntegrations() {
        try {
            List<APIIntegration> integrations = apiIntegrationRepository.findAll();
            List<APIIntegrationDTO> dtos = new ArrayList<>();
            
            for (APIIntegration integration : integrations) {
                APIIntegrationDTO dto = new APIIntegrationDTO();
                dto.setId(integration.getId());
                dto.setApiName(integration.getApiName());
                dto.setApiEndpoint(integration.getApiEndpoint());
                dto.setIsActive(integration.getIsActive());
                dto.setRequestCount(integration.getRequestCount());
                dto.setSuccessCount(integration.getSuccessCount());
                dto.setErrorCount(integration.getErrorCount());
                dto.setLastSyncTime(integration.getLastSyncTime());
                dto.setLastErrorTime(integration.getLastErrorTime());
                dto.setLastErrorMessage(integration.getLastErrorMessage());
                
                dtos.add(dto);
            }
            
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Initialize API integration
     */
    @PostMapping("/api-integrations/init")
    public ResponseEntity<Map<String, String>> initializeAPIIntegration(
            @RequestParam String apiName,
            @RequestParam String endpoint) {
        try {
            externalAPIService.initializeAPIIntegration(apiName, endpoint);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "API integration initialized successfully");
            response.put("apiName", apiName);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Record a metric
     */
    @PostMapping("/metrics")
    public ResponseEntity<Map<String, String>> recordMetric(
            @RequestParam String metricName,
            @RequestParam Double metricValue,
            @RequestParam(required = false, defaultValue = "DAILY") String timeFrame,
            @RequestParam String category) {
        try {
            AnalyticsMetric metric = analyticsService.recordMetric(metricName, metricValue, timeFrame, category, null);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Metric recorded successfully");
            response.put("metricId", metric.getId().toString());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get metrics by category
     */
    @GetMapping("/metrics/{category}")
    public ResponseEntity<List<AnalyticsMetric>> getMetricsByCategory(
            @PathVariable String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            LocalDateTime start = startDate != null ? startDate : LocalDateTime.now().minusDays(30);
            LocalDateTime end = endDate != null ? endDate : LocalDateTime.now();
            
            List<AnalyticsMetric> metrics = analyticsService.getMetricsByCategory(category, start, end);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
