package com.example.backend.model;

import java.time.LocalTime;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="Bus")
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bus_id")
    private Long busId;
    
    @Column(name = "plate_number", nullable = false, unique = true, length = 20)
    private String plateNumber;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "model", length = 50)
    private String model;

    @Column(name="start_time")
    private LocalTime start_time;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;
    
    // Relationships

    @ManyToOne
    @JoinColumn(name="route_id")
    private Route defaultRoute;

    @OneToOne(mappedBy="defaultBus",cascade=CascadeType.ALL)
    private Driver defaultDriver;

    @OneToMany(mappedBy="bus", cascade= CascadeType.ALL)
    private List<Trip> trips;

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

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public List<Trip> getTrips() {
        return trips;
    }

    public void setTrips(List<Trip> trips) {
        this.trips = trips;
    }

    public Driver getDefaultDriver() {
        return defaultDriver;
    }

    public void setDefaultDriver(Driver defaultDriver) {
        this.defaultDriver = defaultDriver;
    }

    public Route getDefaultRoute() {
        return defaultRoute;
    }

    public void setDefaultRoute(Route defaultRoute) {
        this.defaultRoute = defaultRoute;
    }

    public LocalTime getStart_time() {
        return start_time;
    }

    public void setStart_time(LocalTime start_time) {
        this.start_time = start_time;
    }
    // Enum for status
    public enum Status {
        active, maintenance, inactive
    }
    // Constructors
    public Bus() {}
    public Bus(String plateNumber, Integer capacity, String model, Status status) {
        this.plateNumber = plateNumber;
        this.capacity = capacity;
        this.model = model;
        this.status = status;
    }
}
