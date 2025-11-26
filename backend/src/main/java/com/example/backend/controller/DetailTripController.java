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

import com.example.backend.dto.DetailTripDTO;
import com.example.backend.service.DetailTripService;

@RestController
@RequestMapping("/api/detail-trips")
@CrossOrigin(origins = "http://localhost:5173")
public class DetailTripController {

@Autowired
private DetailTripService detailTripService;

// GET ALL DETAIL TRIPS
@GetMapping
public ResponseEntity<List<DetailTripDTO>> getAllDetailTrips() {
    List<DetailTripDTO> detailTrips = detailTripService.getAllDetailTrips();
    return ResponseEntity.ok(detailTrips);
}

// GET DETAIL TRIP BY ID
@GetMapping("/{id}")
public ResponseEntity<DetailTripDTO> getDetailTripById(@PathVariable Long id) {
    DetailTripDTO detailTrip = detailTripService.getDetailTripById(id);
    return ResponseEntity.ok(detailTrip);
}

// DELETE DETAIL TRIP
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteDetailTrip(@PathVariable Long id) {
    detailTripService.deleteDetailTrip(id);
    return ResponseEntity.noContent().build();
}


}
