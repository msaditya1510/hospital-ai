package com.teamechelon.hospitalai.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class HospitalService {

    public List<Map<String, Object>> getHospitalStatus() {
        return Arrays.asList(
            Map.of("name", "AIIMS Delhi", "status", "MODERATE", "capacity", 65, "bedsAvailable", 35),
            Map.of("name", "Apollo Hospital", "status", "NORMAL", "capacity", 45, "bedsAvailable", 55),
            Map.of("name", "Max Healthcare", "status", "CRITICAL", "capacity", 92, "bedsAvailable", 8)
        );
    }
    
    public Map<String, Object> simulateCrisis(String crisisType) {
        Map<String, Object> simulation = new HashMap<>();
        simulation.put("crisis", crisisType);
        simulation.put("affectedHospitals", 12);
        simulation.put("estimatedPatients", 1500);
        simulation.put("responseTime", "2-4 hours");
        simulation.put("autoActions", Arrays.asList(
            "Alerted staff networks",
            "Triggered supply chain protocols",
            "Notified partner hospitals"
        ));
        return simulation;
    }
}