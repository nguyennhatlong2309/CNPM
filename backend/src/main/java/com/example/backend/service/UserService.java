package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.UserDTO;
import com.example.backend.model.Message;
import com.example.backend.model.NotificationToUser;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    
    // ENTITY → DTO
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();

        dto.setUserId(user.getUserId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setPasswordHash(user.getPasswordHash());
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        dto.setCreatedAt(user.getCreatedAt());


        if (user.getNotificationToUsers() != null) {
            List<Long> notifiIds = user.getNotificationToUsers()
                    .stream()
                    .map(NotificationToUser::getNotificationtouser_id)
                    .collect(Collectors.toList());
            dto.setNotificationToUserIds(notifiIds);
        }

        if (user.getReceivedMessages() != null) {
            List<Long> recIds = user.getReceivedMessages()
                    .stream()
                    .map(Message::getMessId)
                    .collect(Collectors.toList());
            dto.setReceivedMessageIds(recIds);
        }

        if (user.getSentMessages() != null) {
            List<Long> sentIds = user.getSentMessages()
                    .stream()
                    .map(Message::getMessId)
                    .collect(Collectors.toList());
            dto.setSentMessageIds(sentIds);
        }

        return dto;
    }

    
    // GET ALL
    
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    
    // GET BY ID
    
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    
    // DELETE
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
