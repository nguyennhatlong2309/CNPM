package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.NotificationDTO;
import com.example.backend.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {


@Autowired
private NotificationService notificationService;

// GET ALL NOTIFICATIONS
@GetMapping
public ResponseEntity<List<NotificationDTO>> getAllNotifications() {
    List<NotificationDTO> notifications = notificationService.getAllNotifications();
    return ResponseEntity.ok(notifications);
}

// GET NOTIFICATION BY ID
@GetMapping("/{id}")
public ResponseEntity<NotificationDTO> getNotificationById(@PathVariable Long id) {
    NotificationDTO notification = notificationService.getNotificationById(id);
    return ResponseEntity.ok(notification);
}

// DELETE NOTIFICATION
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
    notificationService.deleteNotification(id);
    return ResponseEntity.noContent().build();
}


}
