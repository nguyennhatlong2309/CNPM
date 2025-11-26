package com.example.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class SchoolYearDTO {

    private Long yearId;

    private String yearName;
    private LocalDate startDate;
    private LocalDate endDate;

    // Quan hệ -> chỉ giữ danh sách ID Trip
    private List<Long> tripIds;

    public Long getYearId() {
        return yearId;
    }

    public void setYearId(Long yearId) {
        this.yearId = yearId;
    }

    public String getYearName() {
        return yearName;
    }

    public void setYearName(String yearName) {
        this.yearName = yearName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public List<Long> getTripIds() {
        return tripIds;
    }

    public void setTripIds(List<Long> tripIds) {
        this.tripIds = tripIds;
    }
}
