package com.wellness.marketplace.dto;

import java.time.LocalDateTime;

public class RecommendationDTO {
    
    private Long id;
    private Long userId;
    private String symptom;
    private String suggestedTherapy;
    private String sourceAPI;
    private LocalDateTime timestamp;
    
    // Enriched data fields
    private String fdaDrugInfo;
    private String whoGuidelines;
    private String fitnessData;
    private String enrichedDescription;
    private String confidenceLevel;
    
    // Constructors
    public RecommendationDTO() {
    }
    
    public RecommendationDTO(Long id, Long userId, String symptom, String suggestedTherapy, 
                            String sourceAPI, LocalDateTime timestamp, String confidenceLevel) {
        this.id = id;
        this.userId = userId;
        this.symptom = symptom;
        this.suggestedTherapy = suggestedTherapy;
        this.sourceAPI = sourceAPI;
        this.timestamp = timestamp;
        this.confidenceLevel = confidenceLevel;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getSymptom() {
        return symptom;
    }
    
    public void setSymptom(String symptom) {
        this.symptom = symptom;
    }
    
    public String getSuggestedTherapy() {
        return suggestedTherapy;
    }
    
    public void setSuggestedTherapy(String suggestedTherapy) {
        this.suggestedTherapy = suggestedTherapy;
    }
    
    public String getSourceAPI() {
        return sourceAPI;
    }
    
    public void setSourceAPI(String sourceAPI) {
        this.sourceAPI = sourceAPI;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getFdaDrugInfo() {
        return fdaDrugInfo;
    }
    
    public void setFdaDrugInfo(String fdaDrugInfo) {
        this.fdaDrugInfo = fdaDrugInfo;
    }
    
    public String getWhoGuidelines() {
        return whoGuidelines;
    }
    
    public void setWhoGuidelines(String whoGuidelines) {
        this.whoGuidelines = whoGuidelines;
    }
    
    public String getFitnessData() {
        return fitnessData;
    }
    
    public void setFitnessData(String fitnessData) {
        this.fitnessData = fitnessData;
    }
    
    public String getEnrichedDescription() {
        return enrichedDescription;
    }
    
    public void setEnrichedDescription(String enrichedDescription) {
        this.enrichedDescription = enrichedDescription;
    }
    
    public String getConfidenceLevel() {
        return confidenceLevel;
    }
    
    public void setConfidenceLevel(String confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }
}
