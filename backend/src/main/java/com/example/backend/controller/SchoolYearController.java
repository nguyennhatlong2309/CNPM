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

import com.example.backend.dto.SchoolYearDTO;
import com.example.backend.service.SchoolYearService;

@RestController
@RequestMapping("/api/school-years")
@CrossOrigin(origins = "http://localhost:5173")
public class SchoolYearController {


@Autowired
private SchoolYearService schoolYearService;

// GET ALL
@GetMapping
public ResponseEntity<List<SchoolYearDTO>> getAllSchoolYears() {
    List<SchoolYearDTO> schoolYears = schoolYearService.getAllSchoolYears();
    return ResponseEntity.ok(schoolYears);
}

// GET BY ID
@GetMapping("/{id}")
public ResponseEntity<SchoolYearDTO> getSchoolYearById(@PathVariable Long id) {
    SchoolYearDTO schoolYear = schoolYearService.getSchoolYearById(id);
    return ResponseEntity.ok(schoolYear);
}

// DELETE BY ID
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteSchoolYear(@PathVariable Long id) {
    schoolYearService.deleteSchoolYear(id);
    return ResponseEntity.noContent().build();
}


}

