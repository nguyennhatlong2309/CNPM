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

import com.example.backend.dto.DriverDTO;
import com.example.backend.service.DriverService;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "http://localhost:5173")
public class DriverController {


@Autowired
private DriverService driverService;

// GET ALL DRIVERS
@GetMapping
public ResponseEntity<List<DriverDTO>> getAllDrivers() {
    List<DriverDTO> drivers = driverService.getAllDrivers();
    return ResponseEntity.ok(drivers);
}

// GET DRIVER BY ID
@GetMapping("/{id}")
public ResponseEntity<DriverDTO> getDriverById(@PathVariable Long id) {
    DriverDTO driver = driverService.getDriverById(id);
    return ResponseEntity.ok(driver);
}

// DELETE DRIVER
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
    driverService.deleteDriver(id);
    return ResponseEntity.noContent().build();
}


}
