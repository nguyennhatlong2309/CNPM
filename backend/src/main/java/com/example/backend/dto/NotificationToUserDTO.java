package com.example.backend.dto;

public class NotificationToUserDTO {

    private Long notificationToUserId;

    private Long notificationId;
    private Long userId;

    private Boolean isRead;

    public Long getNotificationToUserId() {
        return notificationToUserId;
    }

    public void setNotificationToUserId(Long notificationToUserId) {
        this.notificationToUserId = notificationToUserId;
    }

    public Long getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
}
