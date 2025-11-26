package com.example.backend.dto;

import java.sql.Time;
import java.time.LocalDate;
import java.util.List;

public class TripDTO {

    private Long tripId;

    private Long driverId;
    private Long busId;
    private Long routeId;
    private Long schoolYearId;
    private LocalDate tripDate;
    private Time startTime;
    private Time endTime;
    private String status;
    private List<Long> detailTripIds;
    private List<Long> incidentIds;

    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public Long getSchoolYearId() {
        return schoolYearId;
    }

    public void setSchoolYearId(Long schoolYearId) {
        this.schoolYearId = schoolYearId;
    }

    public LocalDate getTripDate() {
        return tripDate;
    }

    public void setTripDate(LocalDate tripDate) {
        this.tripDate = tripDate;
    }

    public Time getStartTime() {
        return startTime;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Long> getDetailTripIds() {
        return detailTripIds;
    }

    public void setDetailTripIds(List<Long> detailTripIds) {
        this.detailTripIds = detailTripIds;
    }

    public List<Long> getIncidentIds() {
        return incidentIds;
    }

    public void setIncidentIds(List<Long> incidentIds) {
        this.incidentIds = incidentIds;
    }
}
