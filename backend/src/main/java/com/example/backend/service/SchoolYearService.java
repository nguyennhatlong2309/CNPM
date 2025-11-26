package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.SchoolYearDTO;
import com.example.backend.model.SchoolYear;
import com.example.backend.model.Trip;
import com.example.backend.repository.SchoolYearRepository;

@Service
public class SchoolYearService {

    @Autowired
    private SchoolYearRepository schoolYearRepository;

    
    // ENTITY → DTO
    
    private SchoolYearDTO convertToDTO(SchoolYear schoolYear) {
        SchoolYearDTO dto = new SchoolYearDTO();

        dto.setYearId(schoolYear.getYearId());
        dto.setYearName(schoolYear.getYearName());
        dto.setStartDate(schoolYear.getStartDate());
        dto.setEndDate(schoolYear.getEndDate());

        // Quan hệ -> chỉ ID
        if (schoolYear.getTrips() != null) {
            List<Long> tripIds = schoolYear.getTrips()
                    .stream()
                    .map(Trip::getTripId)
                    .collect(Collectors.toList());
            dto.setTripIds(tripIds);
        }

        return dto;
    }

    
    // GET ALL
    
    public List<SchoolYearDTO> getAllSchoolYears() {
        return schoolYearRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    
    // GET BY ID
    
    public SchoolYearDTO getSchoolYearById(Long id) {
        SchoolYear schoolYear = schoolYearRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SchoolYear not found"));

        return convertToDTO(schoolYear);
    }

    
    // DELETE
    
    public void deleteSchoolYear(Long id) {
        schoolYearRepository.deleteById(id);
    }
}
