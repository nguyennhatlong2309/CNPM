package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.IncidentDTO;
import com.example.backend.service.IncidentService;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "http://localhost:5173")
public class IncidentController {


@Autowired
private IncidentService incidentService;

// GET ALL INCIDENTS
@GetMapping
public ResponseEntity<List<IncidentDTO>> getAllIncidents() {
    List<IncidentDTO> incidents = incidentService.getAllIncidents();
    return ResponseEntity.ok(incidents);
}

// GET INCIDENT BY ID
@GetMapping("/{id}")
public ResponseEntity<IncidentDTO> getIncidentById(@PathVariable Long id) {
    IncidentDTO incident = incidentService.getIncidentById(id);
    return ResponseEntity.ok(incident);
}

// DELETE INCIDENT
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
    incidentService.deleteIncident(id);
    return ResponseEntity.noContent().build();
}


}
