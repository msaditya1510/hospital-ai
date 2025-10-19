package com.teamechelon.hospitalai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.teamechelon.hospitalai.service.HospitalService;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "https://swasthya-ai-six.vercel.app"
})
public class PredictionController {

    @GetMapping("/predict-surge")

    public Map<String, Object> predictSurge(
            @RequestParam(defaultValue = "diwali") String event,
            @RequestParam(defaultValue = "150") int pollutionLevel) {
        
        Map<String, Object> response = new HashMap<>();
        
        // Risk calculation
        int riskScore = calculateRiskScore(event, pollutionLevel);
        String riskLevel = riskScore > 70 ? "HIGH" : riskScore > 40 ? "MEDIUM" : "LOW";
        
        // FIXED: Using exact field names frontend expects
        response.put("riskLevel", riskLevel);
        response.put("riskScore", riskScore);
        response.put("predictedSurge", riskScore ); // Frontend expects string with %
        response.put("recommendedAction", getRecommendedAction(riskLevel));
        response.put("confidence", 85);
        
        return response;
    }
    
    private int calculateRiskScore(String event, int pollution) {
        Map<String, Integer> eventWeights = Map.of(
            "diwali", 8, 
            "holi", 6,
            "normal", 2
        );
        int eventWeight = eventWeights.getOrDefault(event.toLowerCase(), 3);
        return eventWeight * (pollution / 20);
    }
    
    private String getRecommendedAction(String riskLevel) {
        return switch (riskLevel) {
            case "HIGH" -> "Increase staff by 40%, pre-order supplies, alert emergency teams";
            case "MEDIUM" -> "Increase staff by 20%, check inventory levels";
            case "LOW" -> "Normal operations, monitor situation";
            default -> "No action required";
        };
    }
    @Autowired
    private HospitalService hospitalService;

    @GetMapping("/hospitals")
    public List<Map<String, Object>> getHospitals() {
        return hospitalService.getHospitalStatus();
    }

    @GetMapping("/simulate-crisis")
    public Map<String, Object> simulateCrisis(@RequestParam String type) {
        return hospitalService.simulateCrisis(type);
    }

    @GetMapping("/agent-coordination")
    public Map<String, Object> agentCoordination() {
        return Map.of(
            "predictiveAgent", "Forecasting 200% surge in 48 hours", // Fixed typo
            "operationsAgent", "Pre-ordering supplies and adjusting staff", // Fixed typo  
            "coordinationAgent", "Negotiating resource sharing between 3 hospitals",
            "status", "ACTIVE"
        );
    }
}
