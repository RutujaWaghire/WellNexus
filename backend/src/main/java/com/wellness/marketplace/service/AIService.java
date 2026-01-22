package com.wellness.marketplace.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AIService {
    
    private Map<String, List<String>> therapyMap = new HashMap<>();
    
    public AIService() {
        therapyMap.put("stress", Arrays.asList("Yoga", "Meditation", "Acupuncture"));
        therapyMap.put("anxiety", Arrays.asList("Ayurveda", "Aromatherapy", "Meditation"));
        therapyMap.put("back pain", Arrays.asList("Chiropractic", "Physiotherapy"));
        therapyMap.put("headache", Arrays.asList("Acupuncture", "Aromatherapy"));
    }
    
    public Map<String, Object> getRecommendations(Long userId, String symptom) {
        Map<String, Object> result = new HashMap<>();
        List<String> therapies = therapyMap.getOrDefault(symptom.toLowerCase(), 
            Arrays.asList("General Wellness"));
        
        result.put("symptom", symptom);
        result.put("recommendedTherapies", therapies);
        result.put("confidenceScore", therapyMap.containsKey(symptom.toLowerCase()) ? 0.85 : 0.60);
        
        return result;
    }
}
