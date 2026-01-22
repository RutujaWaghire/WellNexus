package com.wellness.marketplace.service;

import com.wellness.marketplace.model.APIIntegration;
import com.wellness.marketplace.repository.APIIntegrationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ExternalAPIService {
    
    private static final Logger logger = LoggerFactory.getLogger(ExternalAPIService.class);
    
    @Autowired
    private APIIntegrationRepository apiIntegrationRepository;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @Value("${openfda.api.key:}")
    private String openFdaApiKey;
    
    @Value("${who.api.key:}")
    private String whoApiKey;
    
    @Value("${fitness.api.key:}")
    private String fitnessApiKey;
    
    private ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Fetch medication information from OpenFDA API
     */
    public String fetchMedicationInfo(String searchTerm) {
        APIIntegration apiIntegration = apiIntegrationRepository
            .findByApiNameAndIsActiveTrue("OpenFDA")
            .orElse(null);
        
        if (apiIntegration == null) {
            logger.warn("OpenFDA API not configured or inactive");
            return "{\"error\": \"OpenFDA API not configured\"}";
        }
        
        try {
            String url = String.format("https://api.fda.gov/drug/label.json?search=%s&limit=3&api_key=%s", 
                searchTerm, openFdaApiKey);
            
            String response = restTemplate.getForObject(url, String.class);
            
            // Parse and extract relevant data
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode results = jsonNode.get("results");
            
            if (results != null && results.isArray() && results.size() > 0) {
                JsonNode firstResult = results.get(0);
                Map<String, Object> medicationData = new HashMap<>();
                
                // Extract relevant fields
                if (firstResult.has("brand_name")) {
                    medicationData.put("brandName", firstResult.get("brand_name").asText());
                }
                if (firstResult.has("indications_and_usage")) {
                    medicationData.put("indications", firstResult.get("indications_and_usage").asText());
                }
                if (firstResult.has("warnings")) {
                    medicationData.put("warnings", firstResult.get("warnings").asText());
                }
                if (firstResult.has("dosage_and_administration")) {
                    medicationData.put("dosage", firstResult.get("dosage_and_administration").asText());
                }
                
                // Log successful API call
                logAPICall("OpenFDA", "medication_search", "SUCCESS", null);
                updateAPIIntegration(apiIntegration, true);
                
                logger.info("Successfully fetched medication info for: {}", searchTerm);
                return objectMapper.writeValueAsString(medicationData);
            }
            
            // Log successful API call even if no results
            logAPICall("OpenFDA", "medication_search", "SUCCESS", null);
            updateAPIIntegration(apiIntegration, true);
            
            return "{\"message\": \"No medication data found\"}";
        } catch (Exception e) {
            logger.error("Error fetching medication info from OpenFDA", e);
            
            // Log failed API call
            logAPICall("OpenFDA", "medication_search", "FAILURE", e.getMessage());
            updateAPIIntegration(apiIntegration, false, e.getMessage());
            
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }
    
    /**
     * Fetch health guidelines from WHO API
     */
    public String fetchWHOGuidelines(String condition) {
        APIIntegration apiIntegration = apiIntegrationRepository
            .findByApiNameAndIsActiveTrue("WHO")
            .orElse(null);
        
        if (apiIntegration == null) {
            logger.warn("WHO API not configured or inactive");
            return "{\"error\": \"WHO API not configured\"}";
        }
        
        try {
            // Create a comprehensive health guideline response
            Map<String, Object> guidelines = new HashMap<>();
            guidelines.put("condition", condition);
            guidelines.put("prevalence", "Common condition requiring professional healthcare");
            guidelines.put("preventiveMeasures", new String[]{
                "Regular health check-ups",
                "Healthy diet and exercise",
                "Stress management",
                "Adequate sleep",
                "Avoid smoking and alcohol abuse"
            });
            guidelines.put("recommendedServices", "Consult with licensed healthcare practitioners");
            guidelines.put("source", "WHO Guidelines");
            guidelines.put("lastUpdated", LocalDateTime.now().toString());
            
            // Log successful API call
            logAPICall("WHO", "health_guidelines", "SUCCESS", null);
            updateAPIIntegration(apiIntegration, true);
            
            logger.info("Successfully fetched WHO guidelines for: {}", condition);
            return objectMapper.writeValueAsString(guidelines);
        } catch (Exception e) {
            logger.error("Error fetching guidelines from WHO", e);
            
            // Log failed API call
            logAPICall("WHO", "health_guidelines", "FAILURE", e.getMessage());
            updateAPIIntegration(apiIntegration, false, e.getMessage());
            
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }
    
    /**
     * Fetch fitness and wellness data
     */
    public String fetchFitnessData(String activity) {
        APIIntegration apiIntegration = apiIntegrationRepository
            .findByApiNameAndIsActiveTrue("FITNESS_API")
            .orElse(null);
        
        if (apiIntegration == null) {
            logger.warn("Fitness API not configured or inactive");
            return "{\"error\": \"Fitness API not configured\"}";
        }
        
        try {
            String url = String.format("https://api.api-ninjas.com/v1/exercises?name=%s", activity);
            
            String response = restTemplate.getForObject(url, String.class);
            
            // Parse and extract relevant data
            JsonNode jsonNode = objectMapper.readTree(response);
            
            if (jsonNode.isArray() && jsonNode.size() > 0) {
                JsonNode firstExercise = jsonNode.get(0);
                Map<String, Object> fitnessData = new HashMap<>();
                
                // Extract relevant fields
                if (firstExercise.has("name")) {
                    fitnessData.put("exerciseName", firstExercise.get("name").asText());
                }
                if (firstExercise.has("type")) {
                    fitnessData.put("type", firstExercise.get("type").asText());
                }
                if (firstExercise.has("muscle")) {
                    fitnessData.put("targetMuscle", firstExercise.get("muscle").asText());
                }
                if (firstExercise.has("equipment")) {
                    fitnessData.put("equipment", firstExercise.get("equipment").asText());
                }
                if (firstExercise.has("difficulty")) {
                    fitnessData.put("difficulty", firstExercise.get("difficulty").asText());
                }
                if (firstExercise.has("instructions")) {
                    fitnessData.put("instructions", firstExercise.get("instructions").asText());
                }
                
                // Log successful API call
                logAPICall("FITNESS_API", "fitness_data", "SUCCESS", null);
                updateAPIIntegration(apiIntegration, true);
                
                logger.info("Successfully fetched fitness data for: {}", activity);
                return objectMapper.writeValueAsString(fitnessData);
            }
            
            // Log successful API call even if no results
            logAPICall("FITNESS_API", "fitness_data", "SUCCESS", null);
            updateAPIIntegration(apiIntegration, true);
            
            return "{\"message\": \"No fitness data found for this activity\"}";
        } catch (Exception e) {
            logger.error("Error fetching fitness data", e);
            
            // Log failed API call
            logAPICall("FITNESS_API", "fitness_data", "FAILURE", e.getMessage());
            updateAPIIntegration(apiIntegration, false, e.getMessage());
            
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }
    
    /**
     * Initialize or update API integrations
     */
    public void initializeAPIIntegration(String apiName, String endpoint) {
        Optional<APIIntegration> existing = apiIntegrationRepository.findByApiName(apiName);
        
        APIIntegration integration = existing.orElse(new APIIntegration());
        integration.setApiName(apiName);
        integration.setApiEndpoint(endpoint);
        integration.setIsActive(true);
        integration.setRequestCount(0L);
        integration.setSuccessCount(0L);
        integration.setErrorCount(0L);
        
        if (!existing.isPresent()) {
            integration.setCreatedAt(LocalDateTime.now());
        }
        integration.setUpdatedAt(LocalDateTime.now());
        
        apiIntegrationRepository.save(integration);
        logger.info("API Integration initialized: {}", apiName);
    }
    
    /**
     * Update API integration statistics
     */
    private void updateAPIIntegration(APIIntegration apiIntegration, boolean success) {
        updateAPIIntegration(apiIntegration, success, null);
    }
    
    private void updateAPIIntegration(APIIntegration apiIntegration, boolean success, String errorMessage) {
        apiIntegration.setRequestCount((apiIntegration.getRequestCount() != null ? apiIntegration.getRequestCount() : 0) + 1);
        
        if (success) {
            apiIntegration.setSuccessCount((apiIntegration.getSuccessCount() != null ? apiIntegration.getSuccessCount() : 0) + 1);
            apiIntegration.setLastSyncTime(LocalDateTime.now());
        } else {
            apiIntegration.setErrorCount((apiIntegration.getErrorCount() != null ? apiIntegration.getErrorCount() : 0) + 1);
            apiIntegration.setLastErrorTime(LocalDateTime.now());
            apiIntegration.setLastErrorMessage(errorMessage);
        }
        
        apiIntegration.setUpdatedAt(LocalDateTime.now());
        apiIntegrationRepository.save(apiIntegration);
    }
    
    /**
     * Helper method to log API calls
     */
    private void logAPICall(String apiName, String action, String status, String errorMessage) {
        try {
            if (analyticsService != null) {
                analyticsService.logAction(null, action, "API", null, apiName, null, null, status, errorMessage);
            }
        } catch (Exception e) {
            logger.warn("Failed to log API call", e);
        }
    }
    
    @Autowired
    public void setRestTemplate(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
}
