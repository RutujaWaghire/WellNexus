package com.wellness.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDashboardDTO {
    private Double totalRecommendations;
    private Double totalBookings;
    private Double totalSales;
    private Double totalUsers;
    private Double apiSuccessRate;
    private Long totalNotifications;
    private Long totalActiveUsers;
    private Long totalAIRecommendationsGenerated;
    private java.util.Map<String, Long> categoryBreakdown;
    private java.util.Map<String, Object> apiPerformance;
    private LocalDateTime generatedAt;
}
