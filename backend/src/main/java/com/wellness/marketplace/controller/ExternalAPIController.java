package com.wellness.marketplace.controller;

import com.wellness.marketplace.service.ExternalAPIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/external")
@CrossOrigin(origins = "*")
public class ExternalAPIController {
    
    @Autowired
    private ExternalAPIService externalAPIService;
    
    @GetMapping("/drug")
    public ResponseEntity<Map<String, Object>> searchDrug(@RequestParam String name) {
        return ResponseEntity.ok(externalAPIService.searchDrugInfo(name));
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealthData(@RequestParam String condition) {
        return ResponseEntity.ok(externalAPIService.getHealthData(condition));
    }
}
