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

import com.example.backend.dto.MessageDTO;
import com.example.backend.service.MessageService;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {


@Autowired
private MessageService messageService;

// GET ALL
@GetMapping
public ResponseEntity<List<MessageDTO>> getAllMessages() {
    List<MessageDTO> messages = messageService.getAllMessages();
    return ResponseEntity.ok(messages);
}

// GET BY ID
@GetMapping("/{id}")
public ResponseEntity<MessageDTO> getMessageById(@PathVariable Long id) {
    MessageDTO message = messageService.getMessageById(id);
    return ResponseEntity.ok(message);
}

// DELETE BY ID
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
    messageService.deleteMessage(id);
    return ResponseEntity.noContent().build();
}


}
