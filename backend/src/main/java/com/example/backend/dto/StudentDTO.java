package com.example.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class StudentDTO {

    private Long studentId;
    private String name;
    private LocalDate dateOfBirth;
    private LocalTime defaultTimePickUp;
    private LocalTime defaultTimeDropOff;

    // Quan hệ -> chỉ giữ ID
    private String parentName;
    private Long defaultPickUpPointId;
    private Long defaultDropOffPointId;
    private List<Long> detailTripIds;
    private String status;

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public LocalTime getDefaultTimePickUp() {
        return defaultTimePickUp;
    }

    public void setDefaultTimePickUp(LocalTime defaultTimePickUp) {
        this.defaultTimePickUp = defaultTimePickUp;
    }

    public LocalTime getDefaultTimeDropOff() {
        return defaultTimeDropOff;
    }

    public void setDefaultTimeDropOff(LocalTime defaultTimeDropOff) {
        this.defaultTimeDropOff = defaultTimeDropOff;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public Long getDefaultPickUpPointId() {
        return defaultPickUpPointId;
    }

    public void setDefaultPickUpPointId(Long defaultPickUpPointId) {
        this.defaultPickUpPointId = defaultPickUpPointId;
    }

    public Long getDefaultDropOffPointId() {
        return defaultDropOffPointId;
    }

    public void setDefaultDropOffPointId(Long defaultDropOffPointId) {
        this.defaultDropOffPointId = defaultDropOffPointId;
    }

    public List<Long> getDetailTripIds() {
        return detailTripIds;
    }

    public void setDetailTripIds(List<Long> detailTripIds) {
        this.detailTripIds = detailTripIds;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
