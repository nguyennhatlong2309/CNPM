package com.example.backend.model;

import java.math.BigDecimal;
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
@Table(name="route")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id")
    private Long routeId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "start_point", nullable = false, length = 100)
    private String startPoint;

    @Column(name = "end_point", nullable = false, length = 100)
    private String endPoint;

    @Column(name = "distance_km", precision = 5, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "estimated_time")
    private java.sql.Time estimatedTime;
    
    // Relationships
    @OneToMany(mappedBy="defaultRoute",cascade=CascadeType.ALL)
    private List<Bus> Bus;

    @OneToMany(mappedBy="route",cascade=CascadeType.ALL)
    private List<Trip> trips;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL)
    private List<PickupPoint> pickupDropoffPoints;
    // Constructors
    public Route() {}
    
     public Route(String name, String startPoint, String endPoint, BigDecimal distanceKm, java.sql.Time estimatedTime) {
        this.name = name;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.distanceKm = distanceKm;
        this.estimatedTime = estimatedTime;
    }

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

     public java.sql.Time getEstimatedTime() {
         return estimatedTime;
     }

     public void setEstimatedTime(java.sql.Time estimatedTime) {
         this.estimatedTime = estimatedTime;
     }

     public List<Trip> getTrips() {
         return trips;
     }

     public void setTrips(List<Trip> trips) {
         this.trips = trips;
     }

     public List<PickupPoint> getPickupDropoffPoints() {
         return pickupDropoffPoints;
     }

     public void setPickupDropoffPoints(List<PickupPoint> pickupDropoffPoints) {
         this.pickupDropoffPoints = pickupDropoffPoints;
     }

    public List<Bus> getBus() {
        return Bus;
    }

    public void setBus(List<Bus> Bus) {
        this.Bus = Bus;
    }
}
