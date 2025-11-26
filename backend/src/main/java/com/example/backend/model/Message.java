package com.example.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="message")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mess_id")
    private Long messId;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // Người nhận

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;  // Người gửi

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead;

    // Constructors
    public Message() {}
    public Message(User user, User sender, String content, LocalDateTime sentAt, Boolean isRead) {
        this.user = user;
        this.sender = sender;
        this.content = content;
        this.sentAt = sentAt;
        this.isRead = isRead;
    }

    public Long getMessId() {
        return messId;
    }

    public void setMessId(Long messId) {
        this.messId = messId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
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
