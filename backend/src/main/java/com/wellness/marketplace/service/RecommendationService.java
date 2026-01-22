package com.wellness.marketplace.service;

import com.wellness.marketplace.model.Recommendation;
import com.wellness.marketplace.repository.RecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Service
public class RecommendationService {
    
    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);
    
    @Autowired
    private RecommendationRepository recommendationRepository;
    
    @Autowired
    private ExternalAPIService externalAPIService;
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @Autowired
    private NotificationService notificationService;
    
    private Map<String, String> symptomTherapyMap = new HashMap<>() {{
        put("back pain", "Chiropractic");
        put("stress", "Acupuncture");
        put("anxiety", "Ayurveda");
        put("muscle pain", "Physiotherapy");
        put("headache", "Acupuncture");
        put("joint pain", "Physiotherapy");
        put("insomnia", "Ayurveda");
        put("digestive issues", "Ayurveda");
        put("hypertension", "Yoga Therapy");
        put("diabetes", "Nutritional Therapy");
        put("obesity", "Fitness & Wellness");
        put("sleep disorder", "Ayurveda");
        put("migraine", "Naturopathy");
        put("arthritis", "Physiotherapy");
    }};
    
    /**
     * Generate AI-based recommendation with external API enrichment
     */
    public Recommendation generateRecommendation(Long userId, String symptom) {
        try {
            String suggestedTherapy = symptomTherapyMap.getOrDefault(
                symptom.toLowerCase(), 
                "General Wellness Consultation"
            );
            
            Recommendation recommendation = new Recommendation();
            recommendation.setUserId(userId);
            recommendation.setSymptom(symptom);
            recommendation.setSuggestedTherapy(suggestedTherapy);
            recommendation.setSourceAPI("AI_ENGINE");
            recommendation.setTimestamp(LocalDateTime.now());
            
            // Enrich recommendation with external API data
            enrichRecommendationWithExternalData(recommendation, symptom);
            
            Recommendation savedRecommendation = recommendationRepository.save(recommendation);
            
            // Log analytics
            try {
                analyticsService.logAction(userId, "RECOMMENDATION_GENERATED", "RECOMMENDATIONS", 
                    "Symptom: " + symptom + ", Therapy: " + suggestedTherapy, "AI_ENGINE", 
                    "Recommendation", savedRecommendation.getId(), "SUCCESS", null);
            } catch (Exception e) {
                logger.warn("Failed to log recommendation analytics", e);
            }
            
            // Send notification to user
            try {
                notificationService.sendNotification(userId, "New Health Recommendation", 
                    "We have a personalized recommendation for: " + symptom + ". Suggested: " + suggestedTherapy);
            } catch (Exception e) {
                logger.warn("Failed to send recommendation notification", e);
            }
            
            logger.info("Generated recommendation for user {} with symptom {}", userId, symptom);
            return savedRecommendation;
        } catch (Exception e) {
            logger.error("Error generating recommendation", e);
            
            // Log failed analytics
            try {
                analyticsService.logAction(userId, "RECOMMENDATION_GENERATION_FAILED", "RECOMMENDATIONS", 
                    "Symptom: " + symptom, "AI_ENGINE", null, null, "FAILURE", e.getMessage());
            } catch (Exception ex) {
                logger.warn("Failed to log failed analytics", ex);
            }
            
            throw new RuntimeException("Failed to generate recommendation", e);
        }
    }
    
    /**
     * Enrich recommendation with external API data
     */
    private void enrichRecommendationWithExternalData(Recommendation recommendation, String symptom) {
        try {
            int successCount = 0;
            StringBuilder enrichedDescriptionBuilder = new StringBuilder();
            enrichedDescriptionBuilder.append("Symptom: ").append(symptom).append("\n");
            enrichedDescriptionBuilder.append("Suggested Therapy: ").append(recommendation.getSuggestedTherapy()).append("\n\n");
            
            // Fetch medication info from OpenFDA
            try {
                String medicationDataJson = externalAPIService.fetchMedicationInfo(symptom);
                if (medicationDataJson != null && !medicationDataJson.contains("error") && !medicationDataJson.contains("No medication")) {
                    recommendation.setFdaDrugInfo(medicationDataJson);
                    successCount++;
                    enrichedDescriptionBuilder.append("FDA Drug Information: ").append(medicationDataJson).append("\n\n");
                    logger.info("Successfully added FDA drug info to recommendation");
                }
            } catch (Exception e) {
                logger.warn("Failed to fetch FDA medication info", e);
            }
            
            // Fetch WHO guidelines
            try {
                String whoGuidelinesJson = externalAPIService.fetchWHOGuidelines(symptom);
                if (whoGuidelinesJson != null && !whoGuidelinesJson.contains("error")) {
                    recommendation.setWhoGuidelines(whoGuidelinesJson);
                    successCount++;
                    enrichedDescriptionBuilder.append("WHO Guidelines: ").append(whoGuidelinesJson).append("\n\n");
                    logger.info("Successfully added WHO guidelines to recommendation");
                }
            } catch (Exception e) {
                logger.warn("Failed to fetch WHO guidelines", e);
            }
            
            // Fetch fitness recommendations
            try {
                String fitnessDataJson = externalAPIService.fetchFitnessData(recommendation.getSuggestedTherapy());
                if (fitnessDataJson != null && !fitnessDataJson.contains("error") && !fitnessDataJson.contains("No fitness")) {
                    recommendation.setFitnessData(fitnessDataJson);
                    successCount++;
                    enrichedDescriptionBuilder.append("Fitness Data: ").append(fitnessDataJson).append("\n\n");
                    logger.info("Successfully added fitness data to recommendation");
                }
            } catch (Exception e) {
                logger.warn("Failed to fetch fitness data", e);
            }
            
            // Set enriched description
            recommendation.setEnrichedDescription(enrichedDescriptionBuilder.toString());
            
            // Set confidence level based on number of successful API calls
            if (successCount == 3) {
                recommendation.setConfidenceLevel("HIGH");
            } else if (successCount >= 2) {
                recommendation.setConfidenceLevel("MEDIUM");
            } else if (successCount >= 1) {
                recommendation.setConfidenceLevel("LOW");
            } else {
                recommendation.setConfidenceLevel("LOW");
            }
            
            logger.info("Recommendation enriched with external API data from {} sources for symptom: {}", successCount, symptom);
        } catch (Exception e) {
            logger.warn("Failed to enrich recommendation with external API data", e);
            recommendation.setConfidenceLevel("LOW");
            // Continue without enrichment
        }
    }
    
    /**
     * Get all recommendations for a user
     */
    public List<Recommendation> getUserRecommendations(Long userId) {
        return recommendationRepository.findByUserId(userId);
    }
    
    /**
     * Get recommendations by therapy type
     */
    public List<Recommendation> getRecommendationsByTherapy(String therapy) {
        return recommendationRepository.findBySuggestedTherapy(therapy);
    }
}
