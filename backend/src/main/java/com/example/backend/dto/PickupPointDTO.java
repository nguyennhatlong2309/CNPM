package com.example.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class PickupPointDTO {

    private Long pointId;

    private String name;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String type;
    private Integer orderInRoute;

    // Quan hệ -> chỉ giữ ID
    private Long routeId;
    private List<Long> pickupDetailTripIds;
    private List<Long> dropoffDetailTripIds;
    private Long pickUpStudentId;
    private Long dropOffStudentId;

    public Long getPointId() {
        return pointId;
    }

    public void setPointId(Long pointId) {
        this.pointId = pointId;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getOrderInRoute() {
        return orderInRoute;
    }

    public void setOrderInRoute(Integer orderInRoute) {
        this.orderInRoute = orderInRoute;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public List<Long> getPickupDetailTripIds() {
        return pickupDetailTripIds;
    }

    public void setPickupDetailTripIds(List<Long> pickupDetailTripIds) {
        this.pickupDetailTripIds = pickupDetailTripIds;
    }

    public List<Long> getDropoffDetailTripIds() {
        return dropoffDetailTripIds;
    }

    public void setDropoffDetailTripIds(List<Long> dropoffDetailTripIds) {
        this.dropoffDetailTripIds = dropoffDetailTripIds;
    }

    public Long getPickUpStudentId() {
        return pickUpStudentId;
    }

    public void setPickUpStudentId(Long pickUpStudentId) {
        this.pickUpStudentId = pickUpStudentId;
    }

    public Long getDropOffStudentId() {
        return dropOffStudentId;
    }

    public void setDropOffStudentId(Long dropOffStudentId) {
        this.dropOffStudentId = dropOffStudentId;
    }
}
