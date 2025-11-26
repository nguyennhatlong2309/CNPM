package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.RouteDTO;
import com.example.backend.model.Bus;
import com.example.backend.model.PickupPoint;
import com.example.backend.model.Route;
import com.example.backend.model.Trip;
import com.example.backend.repository.RouteRepository;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    
    // ENTITY → DTO
    
    private RouteDTO convertToDTO(Route route) {
        RouteDTO dto = new RouteDTO();

        dto.setRouteId(route.getRouteId());
        dto.setName(route.getName());
        dto.setStartPoint(route.getStartPoint());
        dto.setEndPoint(route.getEndPoint());
        dto.setDistanceKm(route.getDistanceKm());
        dto.setEstimatedTime(route.getEstimatedTime());

        // Quan hệ -> chỉ ID
        if (route.getBus() != null) {
            List<Long> busIds = route.getBus()
                    .stream()
                    .map(Bus::getBusId)
                    .collect(Collectors.toList());
            dto.setBusIds(busIds);
        }

        if (route.getTrips() != null) {
            List<Long> tripIds = route.getTrips()
                    .stream()
                    .map(Trip::getTripId)
                    .collect(Collectors.toList());
            dto.setTripIds(tripIds);
        }

        if (route.getPickupDropoffPoints() != null) {
            List<Long> pickupIds = route.getPickupDropoffPoints()
                    .stream()
                    .map(PickupPoint::getPointId)
                    .collect(Collectors.toList());
            dto.setPickupDropoffPointIds(pickupIds);
        }

        return dto;
    }

    
    // GET ALL
    
    public List<RouteDTO> getAllRoutes() {
        return routeRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    
    // GET BY ID
    
    public RouteDTO getRouteById(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        return convertToDTO(route);
    }

    
    // DELETE
    
    public void deleteRoute(Long id) {
        routeRepository.deleteById(id);
    }
}
