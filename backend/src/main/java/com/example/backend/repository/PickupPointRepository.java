package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.PickupPoint;



@Repository
public interface PickupPointRepository extends JpaRepository<PickupPoint, Long> {
}