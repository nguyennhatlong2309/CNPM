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

import com.example.backend.dto.BusDTO;
import com.example.backend.service.BusService;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = "http://localhost:5173")
public class BusController {

@Autowired
private BusService busService;

// GET ALL BUSES
@GetMapping
public ResponseEntity<List<BusDTO>> getAllBuses() {
    List<BusDTO> buses = busService.getAllBuses();
    return ResponseEntity.ok(buses);
}

// GET BUS BY ID
@GetMapping("/{id}")
public ResponseEntity<BusDTO> getBusById(@PathVariable Long id) {
    BusDTO bus = busService.getBusById(id);
    return ResponseEntity.ok(bus);
}

// DELETE BUS
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
    busService.deleteBus(id);
    return ResponseEntity.noContent().build();
}


}
