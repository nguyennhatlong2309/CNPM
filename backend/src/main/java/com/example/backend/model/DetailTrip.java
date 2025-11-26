package com.example.backend.model;

import java.sql.Time;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="detailtrip")
public class DetailTrip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Long detailId;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "pickup_point_id")
    private PickupPoint pickupPoint;

    @ManyToOne
    @JoinColumn(name = "dropoff_point_id")
    private PickupPoint dropoffPoint;

    

    @Column(name = "pickup_time")
    private Time pickupTime;

    @Column(name = "dropoff_time")
    private Time dropoffTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    public Long getDetailId() {
        return detailId;
    }

    public void setDetailId(Long detailId) {
        this.detailId = detailId;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public PickupPoint getPickupPoint() {
        return pickupPoint;
    }

    public void setPickupPoint(PickupPoint pickupPoint) {
        this.pickupPoint = pickupPoint;
    }

    public PickupPoint getDropoffPoint() {
        return dropoffPoint;
    }

    public void setDropoffPoint(PickupPoint dropoffPoint) {
        this.dropoffPoint = dropoffPoint;
    }

    public Time getPickupTime() {
        return pickupTime;
    }

    public void setPickupTime(Time pickupTime) {
        this.pickupTime = pickupTime;
    }

    public Time getDropoffTime() {
        return dropoffTime;
    }

    public void setDropoffTime(Time dropoffTime) {
        this.dropoffTime = dropoffTime;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    // Enum for status
    public enum Status {
        picked_up, dropped_off, absent
    }
    // Constructors
    public DetailTrip() {}
    public DetailTrip(Trip trip, Student student, PickupPoint pickupPoint, PickupPoint dropoffPoint, Time pickupTime, Time dropoffTime, Status status) {
        this.trip = trip;
        this.student = student;
        this.pickupPoint = pickupPoint;
        this.dropoffPoint = dropoffPoint;
        this.pickupTime = pickupTime;
        this.dropoffTime = dropoffTime;
        this.status = status;
    }

}
