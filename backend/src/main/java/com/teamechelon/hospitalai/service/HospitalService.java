package com.teamechelon.hospitalai.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class HospitalService {

	public List<Map<String, Object>> getHospitalStatus() {
	    return Arrays.asList(
	        Map.of(
	            "name", "AIIMS Delhi", 
	            "status", "MODERATE", 
	            "totalBeds", 100,        // Frontend expects totalBeds
	            "availableBeds", 35      // Frontend expects availableBeds
	        ),
	        Map.of(
	            "name", "Apollo Hospital", 
	            "status", "NORMAL", 
	            "totalBeds", 120, 
	            "availableBeds", 55
	        ),
	        Map.of(
	            "name", "Max Healthcare", 
	            "status", "CRITICAL", 
	            "totalBeds", 80, 
	            "availableBeds", 8
	        )
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