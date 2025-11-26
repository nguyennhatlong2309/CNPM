package com.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="notificationtouser")
public class NotificationToUser {
    @Id
    @Column(name="notificationtouser_id")
    private long notificationtouser_id;
    
    @ManyToOne
    @JoinColumn(name = "notifi_id", nullable = false) 
    private Notification notification;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "is_read", nullable = false)
    private Boolean isRead;
    // Constructors
    public NotificationToUser() {}
    public NotificationToUser(Notification notification, User user, Boolean isRead) {
        this.notification = notification;
        this.user = user;
        this.isRead = isRead;
    }

    public Notification getNotification() {
        return notification;
    }

    public void setNotification(Notification notification) {
        this.notification = notification;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public long getNotificationtouser_id() {
        return notificationtouser_id;
    }

    public void setNotificationtouser_id(long notificationtouser_id) {
        this.notificationtouser_id = notificationtouser_id;
    }

}
