package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.BusDTO;
import com.example.backend.model.Bus;
import com.example.backend.repository.BusRepository;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;
    // ENTITY -> DTO
    private BusDTO convertToDTO(Bus bus) {
        BusDTO dto = new BusDTO();

        dto.setBusId(bus.getBusId());
        dto.setPlateNumber(bus.getPlateNumber());
        dto.setModel(bus.getModel());
        dto.setCapacity(bus.getCapacity());
        dto.setStatus(bus.getStatus().name());

        // Quan hệ: chỉ set ID
        dto.setDefaultRoute(
            bus.getDefaultRoute() != null ? bus.getDefaultRoute().getName() : null
        );
        dto.setDriver(
            bus.getDefaultDriver() != null ? bus.getDefaultDriver().getDriverId() + " - " + bus.getDefaultDriver().getName() : null
        );
        dto.setStartTime(bus.getStart_time());
        return dto;
    }
    // GET ALL
    public List<BusDTO> getAllBuses() {
        return busRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    // GET BY ID
    public BusDTO getBusById(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        return convertToDTO(bus);
    }
    // DELETE
    public void deleteBus(Long id) {
        busRepository.deleteById(id);
    }


   

}
