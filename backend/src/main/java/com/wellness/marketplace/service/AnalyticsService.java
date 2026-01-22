package com.wellness.marketplace.service;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AnalyticsService {
    
    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);
    private final Map<String, List<Map<String, Object>>> dataStore = new HashMap<>();
    
    public void logActivity(Long userId, String type, String details) {
        Map<String, Object> activity = new HashMap<>();
        activity.put("userId", userId);
        activity.put("type", type);
        activity.put("details", details);
        activity.put("timestamp", LocalDateTime.now());
        
        dataStore.computeIfAbsent("activities", k -> new ArrayList<>()).add(activity);
        logger.info("Activity logged - User: {}, Type: {}", userId, type);
    }
    
    public Map<String, Object> getUserStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        List<Map<String, Object>> activities = dataStore.getOrDefault("activities", new ArrayList<>());
        
        long userActivities = activities.stream()
            .filter(a -> a.get("userId").equals(userId))
            .count();
        
        stats.put("userId", userId);
        stats.put("totalActivities", userActivities);
        stats.put("generatedAt", LocalDateTime.now());
        
        return stats;
    }
    
    public Map<String, Object> getSystemMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalActivities", dataStore.getOrDefault("activities", new ArrayList<>()).size());
        metrics.put("uptime", "99.9%");
        metrics.put("timestamp", LocalDateTime.now());
        return metrics;
    }
}
