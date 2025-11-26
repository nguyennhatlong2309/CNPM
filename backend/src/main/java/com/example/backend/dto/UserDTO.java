package com.example.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class UserDTO {

    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String passwordHash;
    private String role;
    private LocalDateTime createdAt;

    private List<Long> notificationToUserIds;
    private List<Long> receivedMessageIds;
    private List<Long> sentMessageIds;

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getPasswordHash() {
        return passwordHash;
    }
    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public List<Long> getNotificationToUserIds() {
        return notificationToUserIds;
    }
    public void setNotificationToUserIds(List<Long> notificationToUserIds) {
        this.notificationToUserIds = notificationToUserIds;
    }
    public List<Long> getReceivedMessageIds() {
        return receivedMessageIds;
    }
    public void setReceivedMessageIds(List<Long> receivedMessageIds) {
        this.receivedMessageIds = receivedMessageIds;
    }
    public List<Long> getSentMessageIds() {
        return sentMessageIds;
    }
    public void setSentMessageIds(List<Long> sentMessageIds) {
        this.sentMessageIds = sentMessageIds;
    }
}
