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

import com.example.backend.dto.PickupPointDTO;
import com.example.backend.service.PickupPointService;

@RestController
@RequestMapping("/api/pickup-points")
@CrossOrigin(origins = "http://localhost:5173")
public class PickupPointController {


@Autowired
private PickupPointService pickupPointService;

// GET ALL
@GetMapping
public ResponseEntity<List<PickupPointDTO>> getAllPickupPoints() {
    List<PickupPointDTO> points = pickupPointService.getAllPickupPoints();
    return ResponseEntity.ok(points);
}

// GET BY ID
@GetMapping("/{id}")
public ResponseEntity<PickupPointDTO> getPickupPointById(@PathVariable Long id) {
    PickupPointDTO point = pickupPointService.getPickupPointById(id);
    return ResponseEntity.ok(point);
}

// DELETE BY ID
@DeleteMapping("/{id}")
public ResponseEntity<Void> deletePickupPoint(@PathVariable Long id) {
    pickupPointService.deletePickupPoint(id);
    return ResponseEntity.noContent().build();
}


}
