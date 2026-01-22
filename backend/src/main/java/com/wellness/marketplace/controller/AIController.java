package com.wellness.marketplace.controller;

import com.wellness.marketplace.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {
    
    @Autowired
    private AIService aiService;
    
    @GetMapping("/recommendations")
    public ResponseEntity<Map<String, Object>> getRecommendations(
            @RequestParam Long userId,
            @RequestParam String symptom) {
        return ResponseEntity.ok(aiService.getRecommendations(userId, symptom));
    }
}
