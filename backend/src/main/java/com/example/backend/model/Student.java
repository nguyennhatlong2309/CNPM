package com.example.backend.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name="pickuptime", nullable=false)
    private LocalTime defaultTimePickUp;

    @Column(name="dropofftime",nullable=true)
    private LocalTime defaultTimeDropOff;
    
    @Column(name="status")
    private String status;

    @ManyToOne  
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;
    
    @OneToOne
    @JoinColumn(name="pickup_point_id", nullable=false)
    private PickupPoint defaultPickUpPoint;

    @OneToOne
    @JoinColumn(name="dropoff_point_id", nullable=false)
    private PickupPoint defaultDropOffPoint;

    // Relationships
    @OneToMany(mappedBy="student",cascade=CascadeType.ALL)
    private List<DetailTrip> detailTrips;
    // Constructors
    public Student() {}
    public Student(String name, LocalDate dateOfBirth, Parent parent) {
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.parent = parent;
    }
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
    
    public Parent getParent() {
        return parent;
    }
    public void setParent(Parent parent) {
        this.parent = parent;
    }
    public List<DetailTrip> getDetailTrips() {
        return detailTrips;
    }
    public void setDetailTrips(List<DetailTrip> detailTrips) {
        this.detailTrips = detailTrips;
    }

    public PickupPoint getDefaultPickUpPoint() {
        return defaultPickUpPoint;
    }

    public void setDefaultPickUpPoint(PickupPoint pickUpPoint) {
        this.defaultPickUpPoint = pickUpPoint;
    }

    public PickupPoint getDefaultDropOffPoint() {
        return defaultDropOffPoint;
    }

    public void setDefaultDropOffPoint(PickupPoint dropOffPoint) {
        this.defaultDropOffPoint = dropOffPoint;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
