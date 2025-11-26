package com.example.backend.dto;

import java.time.LocalDateTime;

public class MessageDTO {

    private Long messId;

    private Long userId;     // Người nhận
    private Long senderId;   // Người gửi

    private String content;

    private LocalDateTime sentAt;

    private Boolean isRead;

    public Long getMessId() {
        return messId;
    }

    public void setMessId(Long messId) {
        this.messId = messId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
}
