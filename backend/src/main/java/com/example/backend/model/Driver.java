package com.example.backend.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="driver")
public class Driver {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "driver_id")
    private Long driverId;

    @Column(name = "license_number", nullable = false, unique = true, length = 50)
    private String licenseNumber;

    @Column(name = "experience_years", nullable = false)
    private Integer experienceYears;

    @Column(name="driver_name")
    private String name;

    @Column(name="status")
    private String status;

    // Relationships
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @OneToOne
    @JoinColumn(name="bus_id",nullable=true)
    private Bus defaultBus;

    @OneToMany(mappedBy="driver", cascade=CascadeType.ALL)
    private List<Trip> trips;
    
    // Constructors
    public Driver() {}
    public Driver(User user, String licenseNumber, Integer experienceYears) {
        this.user = user;
        this.licenseNumber = licenseNumber;
        this.experienceYears = experienceYears;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public List<Trip> getTrips() {
        return trips;
    }

    public void setTrips(List<Trip> Trips) {
        this.trips = trips;
    }

    public Bus getDefaultBus() {
        return defaultBus;
    }

    public void setDefaultBus(Bus defaultBus) {
        this.defaultBus = defaultBus;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }



    
}
