package com.example.backend.dto;

import java.time.LocalDateTime;

public class IncidentDTO {

    private Long incidentId;

    private Long tripId;  

    private String description;

    private LocalDateTime incidentTime;

    private String severity;

    public Long getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(Long incidentId) {
        this.incidentId = incidentId;
    }

    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getIncidentTime() {
        return incidentTime;
    }

    public void setIncidentTime(LocalDateTime incidentTime) {
        this.incidentTime = incidentTime;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }
}
