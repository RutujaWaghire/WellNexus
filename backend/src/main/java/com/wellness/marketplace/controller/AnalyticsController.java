package com.wellness.marketplace.controller;

import com.wellness.marketplace.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @PostMapping("/log")
    public ResponseEntity<String> logActivity(
            @RequestParam Long userId,
            @RequestParam String type,
            @RequestParam String details) {
        analyticsService.logActivity(userId, type, details);
        return ResponseEntity.ok("Logged");
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserStats(@PathVariable Long userId) {
        return ResponseEntity.ok(analyticsService.getUserStats(userId));
    }
    
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        return ResponseEntity.ok(analyticsService.getSystemMetrics());
    }
}
