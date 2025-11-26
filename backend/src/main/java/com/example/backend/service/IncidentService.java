package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.IncidentDTO;
import com.example.backend.model.Incident;
import com.example.backend.repository.IncidentRepository;

@Service
public class IncidentService {

    @Autowired
    private IncidentRepository incidentRepository;

     
    // ENTITY → DTO
     
    private IncidentDTO convertToDTO(Incident incident) {
        IncidentDTO dto = new IncidentDTO();

        dto.setIncidentId(incident.getIncidentId());
        dto.setDescription(incident.getDescription());
        dto.setIncidentTime(incident.getIncidentTime());
        dto.setSeverity(incident.getSeverity().name());

        // Quan hệ -> chỉ ID
        dto.setTripId(
            incident.getTrip() != null ? incident.getTrip().getTripId() : null
        );

        return dto;
    }

     
    // GET ALL
     
    public List<IncidentDTO> getAllIncidents() {
        return incidentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

     
    // GET BY ID
     
    public IncidentDTO getIncidentById(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        return convertToDTO(incident);
    }

    // DELETE
     
    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }
}
