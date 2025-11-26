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

import com.example.backend.dto.ParentDTO;
import com.example.backend.service.ParentService;

@RestController
@RequestMapping("/api/parents")
@CrossOrigin(origins = "http://localhost:5173")
public class ParentController {


@Autowired
private ParentService parentService;

// GET ALL PARENTS
@GetMapping
public ResponseEntity<List<ParentDTO>> getAllParents() {
    List<ParentDTO> parents = parentService.getAllParents();
    return ResponseEntity.ok(parents);
}

// GET PARENT BY ID
@GetMapping("/{id}")
public ResponseEntity<ParentDTO> getParentById(@PathVariable Long id) {
    ParentDTO parent = parentService.getParentById(id);
    return ResponseEntity.ok(parent);
}

// DELETE PARENT
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteParent(@PathVariable Long id) {
    parentService.deleteParent(id);
    return ResponseEntity.noContent().build();
}


}
