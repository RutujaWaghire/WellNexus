package com.wellness.marketplace.controller;

import com.wellness.marketplace.model.Recommendation;
import com.wellness.marketplace.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
//@CrossOrigin(origins = "*")
public class RecommendationController {
    
    @Autowired
    private RecommendationService recommendationService;
    
    @PostMapping
    public ResponseEntity<Recommendation> generateRecommendation(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String symptom = request.get("symptom").toString();
        return ResponseEntity.ok(recommendationService.generateRecommendation(userId, symptom));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recommendation>> getUserRecommendations(@PathVariable Long userId) {
        return ResponseEntity.ok(recommendationService.getUserRecommendations(userId));
    }
}
