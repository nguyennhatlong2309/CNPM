package com.example.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class NotificationDTO {

    private Long notifiId;

    private String title;
    private String message;
    private LocalDateTime createdAt;
    private String type;
    private List<Long> notificationToUserIds;

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Long> getNotificationToUserIds() {
        return notificationToUserIds;
    }

    public void setNotificationToUserIds(List<Long> notificationToUserIds) {
        this.notificationToUserIds = notificationToUserIds;
    }
}
