package com.example.backend.dto;

import java.math.BigDecimal;
import java.sql.Time;
import java.util.List;

public class RouteDTO {

    private Long routeId;

    private String name;
    private String startPoint;
    private String endPoint;
    private BigDecimal distanceKm;
    private Time estimatedTime;

    // Quan hệ -> chỉ giữ ID
    private List<Long> busIds;
    private List<Long> tripIds;
    private List<Long> pickupDropoffPointIds;

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStartPoint() {
        return startPoint;
    }

    public void setStartPoint(String startPoint) {
        this.startPoint = startPoint;
    }

    public String getEndPoint() {
        return endPoint;
    }

    public void setEndPoint(String endPoint) {
        this.endPoint = endPoint;
    }

    public BigDecimal getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(BigDecimal distanceKm) {
        this.distanceKm = distanceKm;
    }

    public Time getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(Time estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public List<Long> getBusIds() {
        return busIds;
    }

    public void setBusIds(List<Long> busIds) {
        this.busIds = busIds;
    }

    public List<Long> getTripIds() {
        return tripIds;
    }

    public void setTripIds(List<Long> tripIds) {
        this.tripIds = tripIds;
    }

    public List<Long> getPickupDropoffPointIds() {
        return pickupDropoffPointIds;
    }

    public void setPickupDropoffPointIds(List<Long> pickupDropoffPointIds) {
        this.pickupDropoffPointIds = pickupDropoffPointIds;
    }
}
