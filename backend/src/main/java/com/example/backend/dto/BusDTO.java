package com.example.backend.dto;

import java.time.LocalTime;

public class BusDTO {
    private Long busId;
    private String plateNumber;
    private Integer capacity;
    private String model;
    private String status;
    // Quan hệ --> chỉ để ID
    private String defaultRoute;
    private String driver;
    private LocalTime startTime;

    
    public BusDTO(){}
    public BusDTO(Long busId, Integer capacity, String driver, String defaultRoute, String model, String plateNumber, LocalTime startTime, String status) {
        this.busId = busId;
        this.capacity = capacity;
        this.driver = driver;
        this.defaultRoute = defaultRoute;
        this.model = model;
        this.plateNumber = plateNumber;
        this.startTime = startTime;
        this.status = status;
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public String getPlateNumber() {
        return plateNumber;
    }

    public void setPlateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDefaultRoute() {
        return defaultRoute;
    }

    public void setDefaultRoute(String defaultRoute) {
        this.defaultRoute = defaultRoute;
    }

    public String getDriver() {
        return driver;
    }

    public void setDriver(String driver) {
        this.driver = driver;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

   
}
