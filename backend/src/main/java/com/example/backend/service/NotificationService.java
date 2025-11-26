package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.NotificationDTO;
import com.example.backend.model.Notification;
import com.example.backend.model.NotificationToUser;
import com.example.backend.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    
    // ENTITY → DTO
    
    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();

        dto.setNotifiId(notification.getNotifiId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setType(notification.getType().name());

        // Quan hệ -> chỉ lấy ID NotificationToUser
        if (notification.getNotificationToUsers() != null) {
            List<Long> ids = notification.getNotificationToUsers()
                    .stream()
                    .map(NotificationToUser::getNotificationtouser_id)
                    .collect(Collectors.toList());
            dto.setNotificationToUserIds(ids);
        }

        return dto;
    }

    
    // GET ALL
    
    public List<NotificationDTO> getAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    
    // GET BY ID
    
    public NotificationDTO getNotificationById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        return convertToDTO(notification);
    }

    
    // DELETE
    
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
