package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.PickupPointDTO;
import com.example.backend.model.DetailTrip;
import com.example.backend.model.PickupPoint;
import com.example.backend.repository.PickupPointRepository;

@Service
public class PickupPointService {

    @Autowired
    private PickupPointRepository pickupPointRepository;

    
    // ENTITY → DTO
    
    private PickupPointDTO convertToDTO(PickupPoint point) {
        PickupPointDTO dto = new PickupPointDTO();

        dto.setPointId(point.getPointId());
        dto.setName(point.getName());
        dto.setLatitude(point.getLatitude());
        dto.setLongitude(point.getLongitude());
        dto.setType(point.getType() != null ? point.getType().name() : null);
        dto.setOrderInRoute(point.getOrderInRoute());

        // Quan hệ -> chỉ ID
        dto.setRouteId(point.getRoute() != null ? point.getRoute().getRouteId() : null);

        if (point.getPickupDetailTrips() != null) {
            List<Long> pickupIds = point.getPickupDetailTrips()
                    .stream()
                    .map(DetailTrip::getDetailId)
                    .collect(Collectors.toList());
            dto.setPickupDetailTripIds(pickupIds);
        }

        if (point.getDropoffDetailTrips() != null) {
            List<Long> dropoffIds = point.getDropoffDetailTrips()
                    .stream()
                    .map(DetailTrip::getDetailId)
                    .collect(Collectors.toList());
            dto.setDropoffDetailTripIds(dropoffIds);
        }

        dto.setPickUpStudentId(point.getPickUpstudents() != null ? point.getPickUpstudents().getStudentId() : null);
        dto.setDropOffStudentId(point.getDropOffstudents() != null ? point.getDropOffstudents().getStudentId() : null);

        return dto;
    }

    
    // GET ALL
    
    public List<PickupPointDTO> getAllPickupPoints() {
        return pickupPointRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    } 

    
    // GET BY ID
    
    public PickupPointDTO getPickupPointById(Long id) {
        PickupPoint point = pickupPointRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PickupPoint not found"));

        return convertToDTO(point);
    }

    
    // DELETE
    
    public void deletePickupPoint(Long id) {
        pickupPointRepository.deleteById(id);
    }
}
