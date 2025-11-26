package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.MessageDTO;
import com.example.backend.model.Message;
import com.example.backend.model.User;
import com.example.backend.repository.MessageRepository;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    
    // ENTITY → DTO
    
    private MessageDTO convertToDTO(Message message) {
        MessageDTO dto = new MessageDTO();

        dto.setMessId(message.getMessId());
        dto.setContent(message.getContent());
        dto.setSentAt(message.getSentAt());
        dto.setIsRead(message.getIsRead());

        // Quan hệ -> chỉ lấy ID
        dto.setUserId(
            message.getUser() != null ? ((User)message.getUser()).getUserId() : null
        );
        dto.setSenderId(
            message.getSender() != null ? ((User)message.getUser()).getUserId() : null
        );

        return dto;
    }

      
    // GET ALL
    
    public List<MessageDTO> getAllMessages() {
        return messageRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    
    // GET BY ID
    
    public MessageDTO getMessageById(Long id) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        return convertToDTO(message);
    }

    // DELETE
    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }
}
