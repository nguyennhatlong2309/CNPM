package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ParentDTO;
import com.example.backend.model.Parent;
import com.example.backend.model.Student;
import com.example.backend.model.User;
import com.example.backend.repository.ParentRepository;

@Service
public class ParentService {

    @Autowired
    private ParentRepository parentRepository;

    
    // ENTITY → DTO
    
    private ParentDTO convertToDTO(Parent parent) {
        ParentDTO dto = new ParentDTO();

        dto.setParentId(parent.getParentId());
        dto.setAddress(parent.getAddress());
        dto.setOccupation(parent.getOccupation());

        // Quan hệ -> chỉ ID
        dto.setUserId(parent.getUser() != null ? ((User)parent.getUser()).getUserId() : null);

        if (parent.getStudents() != null) {
            List<Long> studentIds = parent.getStudents()
                    .stream()
                    .map(Student::getStudentId)
                    .collect(Collectors.toList());
            dto.setStudentIds(studentIds);
        }

        return dto;
    }

    
    // GET ALL
    
    public List<ParentDTO> getAllParents() {
        return parentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    
    // GET BY ID
    
    public ParentDTO getParentById(Long id) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parent not found"));

        return convertToDTO(parent);
    }

    
    // DELETE
    
    public void deleteParent(Long id) {
        parentRepository.deleteById(id);
    }
}
