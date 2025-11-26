package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.TripDTO;
import com.example.backend.model.DetailTrip;
import com.example.backend.model.Incident;
import com.example.backend.model.Trip;
import com.example.backend.repository.TripRepository;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    
    // ENTITY → DTO
    
    private TripDTO convertToDTO(Trip trip) {
        TripDTO dto = new TripDTO();

        dto.setTripId(trip.getTripId());
        dto.setTripDate(trip.getTripDate());
        dto.setStartTime(trip.getStartTime());
        dto.setEndTime(trip.getEndTime());
        dto.setStatus(trip.getStatus() != null ? trip.getStatus().name() : null);

        if (trip.getDriver() != null) {
            dto.setDriverId(trip.getDriver().getDriverId());
        }

        if (trip.getBus() != null) {
            dto.setBusId(trip.getBus().getBusId());
        }

        if (trip.getRoute() != null) {
            dto.setRouteId(trip.getRoute().getRouteId());
        }

        if (trip.getSchoolYear() != null) {
            dto.setSchoolYearId(trip.getSchoolYear().getYearId());
        }

        if (trip.getDetailTrips() != null) {
            List<Long> detailTripIds = trip.getDetailTrips()
                    .stream()
                    .map(DetailTrip::getDetailId)
                    .collect(Collectors.toList());
            dto.setDetailTripIds(detailTripIds);
        }

        if (trip.getIncidents() != null) {
            List<Long> incidentIds = trip.getIncidents()
                    .stream()
                    .map(Incident::getIncidentId)
                    .collect(Collectors.toList());
            dto.setIncidentIds(incidentIds);
        }

        return dto;
    }

    
    // GET ALL
    
    public List<TripDTO> getAllTrips() {
        return tripRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    
    // GET BY ID
    
    public TripDTO getTripById(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        return convertToDTO(trip);
    }

    
    // DELETE
    
    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }
}
