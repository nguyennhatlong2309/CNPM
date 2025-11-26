package com.example.backend.model;

import java.math.BigDecimal;
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
@Table(name="pickupdropoffpoint")
public class PickupPoint {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "point_id")
    private Long pointId;

    

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "latitude", nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private Type type;

    @Column(name = "order_in_route", nullable = false)
    private Integer orderInRoute;
    
    

    // Relationships
    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @OneToMany(mappedBy="pickupPoint",cascade=CascadeType.ALL)
    private List<DetailTrip> pickupDetailTrips;

    @OneToMany(mappedBy = "dropoffPoint", cascade = CascadeType.ALL)
    private List<DetailTrip> dropoffDetailTrips;

    @OneToOne(mappedBy="defaultPickUpPoint",cascade=CascadeType.ALL)
    private Student pickUpstudents;

    @OneToOne(mappedBy="defaultDropOffPoint",cascade=CascadeType.ALL)
    private Student dropOffstudents;

    

    public Long getPointId() {
        return pointId;
    }

    public void setPointId(Long pointId) {
        this.pointId = pointId;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Integer getOrderInRoute() {
        return orderInRoute;
    }

    public void setOrderInRoute(Integer orderInRoute) {
        this.orderInRoute = orderInRoute;
    }

    public List<DetailTrip> getPickupDetailTrips() {
        return pickupDetailTrips;
    }

    public void setPickupDetailTrips(List<DetailTrip> pickupDetailTrips) {
        this.pickupDetailTrips = pickupDetailTrips;
    }

    public List<DetailTrip> getDropoffDetailTrips() {
        return dropoffDetailTrips;
    }

    public void setDropoffDetailTrips(List<DetailTrip> dropoffDetailTrips) {
        this.dropoffDetailTrips = dropoffDetailTrips;
    }


    public Student getPickUpstudents() {
        return pickUpstudents;
    }

    public void setPickUpstudents(Student pickUpstudents) {
        this.pickUpstudents = pickUpstudents;
    }

    public Student getDropOffstudents() {
        return dropOffstudents;
    }

    public void setDropOffstudents(Student dropOffstudents) {
        this.dropOffstudents = dropOffstudents;
    }
    // Enum for type
    public enum Type {
        pickup, dropoff, both
    }

      public PickupPoint() {}
    public PickupPoint(Route route, String name, BigDecimal latitude, BigDecimal longitude, Type type, Integer orderInRoute) {
        this.route = route;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.type = type;
        this.orderInRoute = orderInRoute;
    }
}
