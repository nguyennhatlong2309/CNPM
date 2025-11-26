package com.example.backend.dto;

import java.sql.Time;

public class DetailTripDTO {

    private Long detailId;

    private Long tripId;
    private Long studentId;
    private Long pickupPointId;
    private Long dropoffPointId;

    private Time pickupTime;
    private Time dropoffTime;

    private String status;

    public Long getDetailId() {
        return detailId;
    }

    public void setDetailId(Long detailId) {
        this.detailId = detailId;
    }

    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getPickupPointId() {
        return pickupPointId;
    }

    public void setPickupPointId(Long pickupPointId) {
        this.pickupPointId = pickupPointId;
    }

    public Long getDropoffPointId() {
        return dropoffPointId;
    }

    public void setDropoffPointId(Long dropoffPointId) {
        this.dropoffPointId = dropoffPointId;
    }

    public Time getPickupTime() {
        return pickupTime;
    }

    public void setPickupTime(Time pickupTime) {
        this.pickupTime = pickupTime;
    }

    public Time getDropoffTime() {
        return dropoffTime;
    }

    public void setDropoffTime(Time dropoffTime) {
        this.dropoffTime = dropoffTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
