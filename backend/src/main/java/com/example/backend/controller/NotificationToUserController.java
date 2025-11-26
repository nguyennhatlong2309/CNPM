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

import com.example.backend.dto.NotificationToUserDTO;
import com.example.backend.service.NotificationToUserService;

@RestController
@RequestMapping("/api/notifications-to-users")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationToUserController {


@Autowired
private NotificationToUserService notificationToUserService;

// GET ALL
@GetMapping
public ResponseEntity<List<NotificationToUserDTO>> getAllNotificationToUsers() {
    List<NotificationToUserDTO> notifications = notificationToUserService.getAllNotificationToUsers();
    return ResponseEntity.ok(notifications);
}

// GET BY ID
@GetMapping("/{id}")
public ResponseEntity<NotificationToUserDTO> getNotificationToUserById(@PathVariable Long id) {
    NotificationToUserDTO notification = notificationToUserService.getNotificationToUserById(id);
    return ResponseEntity.ok(notification);
}

// DELETE BY ID
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteNotificationToUser(@PathVariable Long id) {
    notificationToUserService.deleteNotificationToUser(id);
    return ResponseEntity.noContent().build();
}


}
