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

import com.example.backend.dto.TripDTO;
import com.example.backend.service.TripService;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:5173")
public class TripController {


@Autowired
private TripService tripService;

// GET ALL
@GetMapping
public ResponseEntity<List<TripDTO>> getAllTrips() {
    List<TripDTO> trips = tripService.getAllTrips();
    return ResponseEntity.ok(trips);
}

// GET BY ID
@GetMapping("/{id}")
public ResponseEntity<TripDTO> getTripById(@PathVariable Long id) {
    TripDTO trip = tripService.getTripById(id);
    return ResponseEntity.ok(trip);
}

// DELETE BY ID
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
    tripService.deleteTrip(id);
    return ResponseEntity.noContent().build();
}


}
