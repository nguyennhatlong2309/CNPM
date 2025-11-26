package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.DetailTripDTO;
import com.example.backend.model.DetailTrip;
import com.example.backend.repository.DetailTripRepository;

@Service
public class DetailTripService {

    @Autowired
    private DetailTripRepository detailTripRepository;
    // ENTITY → DTO
    private DetailTripDTO convertToDTO(DetailTrip detailTrip) {
        DetailTripDTO dto = new DetailTripDTO();

        dto.setDetailId(detailTrip.getDetailId());

        // Quan hệ -> chỉ ID
        dto.setTripId(detailTrip.getTrip() != null ? detailTrip.getTrip().getTripId() : null);
        dto.setStudentId(detailTrip.getStudent() != null ? detailTrip.getStudent().getStudentId() : null);
        dto.setPickupPointId(detailTrip.getPickupPoint() != null ? detailTrip.getPickupPoint().getPointId() : null);
        dto.setDropoffPointId(detailTrip.getDropoffPoint() != null ? detailTrip.getDropoffPoint().getPointId() : null);

        dto.setPickupTime(detailTrip.getPickupTime());
        dto.setDropoffTime(detailTrip.getDropoffTime());
        dto.setStatus(detailTrip.getStatus().name());

        return dto;
    }

    // GET ALL
    public List<DetailTripDTO> getAllDetailTrips() {
        return detailTripRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public DetailTripDTO getDetailTripById(Long id) {
        DetailTrip detailTrip = detailTripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DetailTrip not found"));

        return convertToDTO(detailTrip);
    }

    // DELETE
    public void deleteDetailTrip(Long id) {
        detailTripRepository.deleteById(id);
    }
}
