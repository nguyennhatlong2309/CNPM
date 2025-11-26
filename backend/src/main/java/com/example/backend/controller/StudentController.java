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

import com.example.backend.dto.StudentDTO;
import com.example.backend.service.StudentService;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {


@Autowired
private StudentService studentService;

// GET ALL STUDENTS
@GetMapping
public ResponseEntity<List<StudentDTO>> getAllStudents() {
    List<StudentDTO> students = studentService.getAllStudents();
    return ResponseEntity.ok(students);
}

// GET STUDENT BY ID
@GetMapping("/{id}")
public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
    StudentDTO student = studentService.getStudentById(id);
    return ResponseEntity.ok(student);
}

// DELETE STUDENT
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
    studentService.deleteStudent(id);
    return ResponseEntity.noContent().build();
}


}
