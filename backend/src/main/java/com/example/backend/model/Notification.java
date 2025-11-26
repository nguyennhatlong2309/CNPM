package com.example.backend.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notifi_id")
    private Long notifiId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private Type type;

    // Relationships
    @OneToMany(mappedBy="notification",cascade=CascadeType.ALL)
    private List<NotificationToUser> notificationToUsers;

    public Long getNotifiId() {
        return notifiId;
    }

    public void setNotifiId(Long notifiId) {
        this.notifiId = notifiId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public List<NotificationToUser> getNotificationToUsers() {
        return notificationToUsers;
    }

    public void setNotificationToUsers(List<NotificationToUser> notificationToUsers) {
        this.notificationToUsers = notificationToUsers;
    }

    // Enum for type
    public enum Type {
        general, trip_update, incident
    }
    // Constructors
    public Notification() {}
    
    public Notification(String title, String message, LocalDateTime createdAt, Type type) {
        this.title = title;
        this.message = message;
        this.createdAt = createdAt;
        this.type = type;
    }



}
