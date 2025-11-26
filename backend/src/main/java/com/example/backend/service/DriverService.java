package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.DriverDTO;
import com.example.backend.model.Driver;
import com.example.backend.model.User;
import com.example.backend.repository.DriverRepository;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    // ENTITY → DTO
    private DriverDTO convertToDTO(Driver driver) {
        DriverDTO dto = new DriverDTO();

        dto.setDriverId(driver.getDriverId());
        dto.setDriverName(driver.getName());
        dto.setStatus(driver.getStatus());
        dto.setUserId(driver.getUser() != null ? ((User) driver.getUser()).getUserId() : null);
        dto.setPhoneNum(driver.getUser() != null ? ((User) driver.getUser()).getPhone() : null);
        dto.setPlateNum(driver.getDefaultBus() != null ? driver.getDefaultBus().getPlateNumber() : null);
        dto.setDefaultRoute(driver.getDefaultBus().getDefaultRoute().getName());
        dto.setStarTime(driver.getDefaultBus().getStart_time());
    

        return dto;
    }
    // GET ALL
    public List<DriverDTO> getAllDrivers() {
        return driverRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public DriverDTO getDriverById(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        return convertToDTO(driver);
    }

    // DELETE
    public void deleteDriver(Long id) {
        driverRepository.deleteById(id);
    }

}
