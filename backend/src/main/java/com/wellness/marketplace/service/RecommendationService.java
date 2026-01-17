package com.wellness.marketplace.service;

import com.wellness.marketplace.model.Recommendation;
import com.wellness.marketplace.repository.RecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Service
public class RecommendationService {
    
    @Autowired
    private RecommendationRepository recommendationRepository;
    
    private Map<String, String> symptomTherapyMap = new HashMap<>() {{
        put("back pain", "Chiropractic");
        put("stress", "Acupuncture");
        put("anxiety", "Ayurveda");
        put("muscle pain", "Physiotherapy");
        put("headache", "Acupuncture");
        put("joint pain", "Physiotherapy");
        put("insomnia", "Ayurveda");
        put("digestive issues", "Ayurveda");
    }};
    
    public Recommendation generateRecommendation(Long userId, String symptom) {
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
        
        return recommendationRepository.save(recommendation);
    }
    
    public List<Recommendation> getUserRecommendations(Long userId) {
        return recommendationRepository.findByUserId(userId);
    }
}
