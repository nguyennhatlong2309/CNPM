package com.example.backend.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="schoolyear")
public class SchoolYear {
    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "year_id")
    private Long yearId;

    @Column(name = "year_name", nullable = false, length = 20)
    private String yearName;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    // Relationships
    @OneToMany(mappedBy="schoolYear",cascade=CascadeType.ALL)
    private List<Trip> trips;
    
    // Constructors
    public SchoolYear() {}
    public SchoolYear(String yearName, LocalDate startDate, LocalDate endDate) {
        this.yearName = yearName;
        this.startDate = startDate;
        this.endDate = endDate;
    }
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
    public List<Trip> getTrips() {
        return trips;
    }
    public void setTrips(List<Trip> trips) {
        this.trips = trips;
    }
}
