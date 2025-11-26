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

import com.example.backend.dto.RouteDTO;
import com.example.backend.service.RouteService;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "http://localhost:5173")
public class RouteController {


@Autowired
private RouteService routeService;

// GET ALL ROUTES
@GetMapping
public ResponseEntity<List<RouteDTO>> getAllRoutes() {
    List<RouteDTO> routes = routeService.getAllRoutes();
    return ResponseEntity.ok(routes);
}

// GET ROUTE BY ID
@GetMapping("/{id}")
public ResponseEntity<RouteDTO> getRouteById(@PathVariable Long id) {
    RouteDTO route = routeService.getRouteById(id);
    return ResponseEntity.ok(route);
}

// DELETE ROUTE
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteRoute(@PathVariable Long id) {
    routeService.deleteRoute(id);
    return ResponseEntity.noContent().build();
}


}
