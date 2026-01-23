package com.wellness.marketplace.controller;

import com.wellness.marketplace.model.Recommendation;
import com.wellness.marketplace.dto.RecommendationDTO;
import com.wellness.marketplace.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
//@CrossOrigin(origins = "*")
public class RecommendationController {
    
    private static final Logger logger = LoggerFactory.getLogger(RecommendationController.class);
    
    @Autowired
    private RecommendationService recommendationService;
    
    /**
     * Generate AI recommendation with external API enrichment
     */
    @PostMapping
    public ResponseEntity<RecommendationDTO> generateRecommendation(@RequestBody Map<String, Object> request) {
        logger.info("Received recommendation request: {}", request);
        
        // Validate required fields
        if (request == null || !request.containsKey("userId") || !request.containsKey("symptom")) {
            logger.error("Missing required fields. Request keys: {}", request != null ? request.keySet() : "null");
            throw new IllegalArgumentException("Missing required fields: userId and symptom are required");
        }
        
        Object userIdObj = request.get("userId");
        Object symptomObj = request.get("symptom");
        
        if (userIdObj == null || symptomObj == null) {
            logger.error("Null field values - userId: {}, symptom: {}", userIdObj, symptomObj);
            throw new IllegalArgumentException("Missing required fields: userId and symptom cannot be null");
        }
        
        try {
            Long userId = Long.valueOf(userIdObj.toString());
            String symptom = symptomObj.toString().trim();
            
            if (symptom.isEmpty()) {
                throw new IllegalArgumentException("Symptom cannot be empty");
            }
            
            logger.info("Processing recommendation for userId: {}, symptom: {}", userId, symptom);
            Recommendation recommendation = recommendationService.generateRecommendation(userId, symptom);
            return ResponseEntity.ok(convertToDTO(recommendation));
        } catch (NumberFormatException e) {
            logger.error("Invalid userId format: {}", userIdObj, e);
            throw new IllegalArgumentException("Invalid userId format");
        }
    }
    
    /**
     * Get all recommendations for a user with enriched data
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecommendationDTO>> getUserRecommendations(@PathVariable Long userId) {
        List<Recommendation> recommendations = recommendationService.getUserRecommendations(userId);
        List<RecommendationDTO> dtos = recommendations.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Get recommendations by therapy type with enriched data
     */
    @GetMapping("/therapy/{therapy}")
    public ResponseEntity<List<RecommendationDTO>> getRecommendationsByTherapy(@PathVariable String therapy) {
        List<Recommendation> recommendations = recommendationService.getRecommendationsByTherapy(therapy);
        List<RecommendationDTO> dtos = recommendations.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Convert Recommendation entity to DTO
     */
    private RecommendationDTO convertToDTO(Recommendation recommendation) {
        RecommendationDTO dto = new RecommendationDTO();
        dto.setId(recommendation.getId());
        dto.setUserId(recommendation.getUserId());
        dto.setSymptom(recommendation.getSymptom());
        dto.setSuggestedTherapy(recommendation.getSuggestedTherapy());
        dto.setSourceAPI(recommendation.getSourceAPI());
        dto.setTimestamp(recommendation.getTimestamp());
        dto.setFdaDrugInfo(recommendation.getFdaDrugInfo());
        dto.setWhoGuidelines(recommendation.getWhoGuidelines());
        dto.setFitnessData(recommendation.getFitnessData());
        dto.setEnrichedDescription(recommendation.getEnrichedDescription());
        dto.setConfidenceLevel(recommendation.getConfidenceLevel());
        return dto;
    }
}
