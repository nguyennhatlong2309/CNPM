package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.StudentDTO;
import com.example.backend.model.DetailTrip;
import com.example.backend.model.Student;
import com.example.backend.repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    
    // ENTITY → DTO
    
    private StudentDTO convertToDTO(Student student) {
        StudentDTO dto = new StudentDTO();

        dto.setStudentId(student.getStudentId());
        dto.setName(student.getName());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setDefaultTimePickUp(student.getDefaultTimePickUp());
        dto.setDefaultTimeDropOff(student.getDefaultTimeDropOff());

        // Quan hệ -> chỉ ID
        if (student.getParent() != null) {
            dto.setParentName(student.getParent().getUser().getName());
        }

        if (student.getDefaultPickUpPoint() != null) {
            dto.setDefaultPickUpPointId(student.getDefaultPickUpPoint().getPointId());
        }

        if (student.getDefaultDropOffPoint() != null) {
            dto.setDefaultDropOffPointId(student.getDefaultDropOffPoint().getPointId());
        }

        if (student.getDetailTrips() != null) {
            List<Long> detailTripIds = student.getDetailTrips()
                    .stream()
                    .map(DetailTrip::getDetailId)
                    .collect(Collectors.toList());
            dto.setDetailTripIds(detailTripIds);
        }

        return dto;
    }

    
    // GET ALL
    
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    
    // GET BY ID
    
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return convertToDTO(student);
    }

    
    // DELETE
    
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}
