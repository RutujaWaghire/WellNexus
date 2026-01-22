package com.wellness.marketplace.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ExternalAPIService {
    
    public Map<String, Object> searchDrugInfo(String drugName) {
        Map<String, Object> result = new HashMap<>();
        result.put("drugName", drugName);
        result.put("status", "Use OpenFDA API for detailed drug information");
        return result;
    }
    
    public Map<String, Object> getHealthData(String condition) {
        Map<String, Object> result = new HashMap<>();
        result.put("condition", condition);
        result.put("source", "WHO Database");
        return result;
    }
}
