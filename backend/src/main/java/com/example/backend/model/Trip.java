package com.example.backend.model;

import java.sql.Time;
import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="trip")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trip_id")
    private Long tripId;

    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;
 
    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne
    @JoinColumn(name = "year_id", nullable = false)
    private SchoolYear schoolYear;

    @Column(name = "trip_date", nullable = false)
    private LocalDate tripDate;

    @Column(name = "start_time", nullable = false)
    private Time startTime;

    @Column(name = "end_time")
    private Time endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @OneToMany(mappedBy="trip",cascade=CascadeType.ALL)
    private List<DetailTrip> detailTrips;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL)
    private List<Incident> incidents;
    
    // Enum for status
    public enum Status {
        scheduled, ongoing, completed, cancelled
    }
    // Constructors
    public Trip() {}
    public Trip(Driver driver, Bus bus, Route route, SchoolYear schoolYear, LocalDate tripDate, Time startTime, Time endTime, Status status) {
        this.driver = driver;
        this.bus = bus;
        this.route = route;
        this.schoolYear = schoolYear;
        this.tripDate = tripDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }
    public Long getTripId() {
        return tripId;
    }
    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }
    public Driver getDriver() {
        return driver;
    }
    public void setDriver(Driver driver) {
        this.driver = driver;
    }
    public Bus getBus() {
        return bus;
    }
    public void setBus(Bus bus) {
        this.bus = bus;
    }
    public Route getRoute() {
        return route;
    }
    public void setRoute(Route route) {
        this.route = route;
    }
    public SchoolYear getSchoolYear() {
        return schoolYear;
    }
    public void setSchoolYear(SchoolYear schoolYear) {
        this.schoolYear = schoolYear;
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
    public Status getStatus() {
        return status;
    }
    public void setStatus(Status status) {
        this.status = status;
    }
    public List<DetailTrip> getDetailTrips() {
        return detailTrips;
    }
    public void setDetailTrips(List<DetailTrip> detailTrips) {
        this.detailTrips = detailTrips;
    }
    public List<Incident> getIncidents() {
        return incidents;
    }
    public void setIncidents(List<Incident> incidents) {
        this.incidents = incidents;
    }
}
