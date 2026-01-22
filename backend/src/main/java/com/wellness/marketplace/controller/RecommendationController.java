package com.wellness.marketplace.controller;

import com.wellness.marketplace.model.Recommendation;
import com.wellness.marketplace.dto.RecommendationDTO;
import com.wellness.marketplace.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
//@CrossOrigin(origins = "*")
public class RecommendationController {
    
    @Autowired
    private RecommendationService recommendationService;
    
    /**
     * Generate AI recommendation with external API enrichment
     */
    @PostMapping
    public ResponseEntity<RecommendationDTO> generateRecommendation(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String symptom = request.get("symptom").toString();
        Recommendation recommendation = recommendationService.generateRecommendation(userId, symptom);
        return ResponseEntity.ok(convertToDTO(recommendation));
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
