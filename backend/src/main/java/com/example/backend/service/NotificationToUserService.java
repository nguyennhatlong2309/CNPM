package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.NotificationToUserDTO;
import com.example.backend.model.NotificationToUser;
import com.example.backend.model.User;
import com.example.backend.repository.NotificationToUserRepository;

@Service
public class NotificationToUserService {

    @Autowired
    private NotificationToUserRepository notificationToUserRepository;

    
    // ENTITY → DTO
    
    private NotificationToUserDTO convertToDTO(NotificationToUser entity) {
        NotificationToUserDTO dto = new NotificationToUserDTO();

        dto.setNotificationToUserId(entity.getNotificationtouser_id());
        dto.setIsRead(entity.getIsRead());

        // Quan hệ -> chỉ ID
        dto.setNotificationId(entity.getNotification() != null ? entity.getNotification().getNotifiId() : null);
        dto.setUserId(entity.getUser() != null ? ((User)entity.getUser()).getUserId() : null);

        return dto;
    }

    
    // GET ALL
    
    public List<NotificationToUserDTO> getAllNotificationToUsers() {
        return notificationToUserRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    
    // GET BY ID
    
    public NotificationToUserDTO getNotificationToUserById(Long id) {
        NotificationToUser entity = notificationToUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NotificationToUser not found"));

        return convertToDTO(entity);
    }

    
    // DELETE
    
    public void deleteNotificationToUser(Long id) {
        notificationToUserRepository.deleteById(id);
    }
}
