package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.SchoolYear;

@Repository
public interface SchoolYearRepository  extends JpaRepository<SchoolYear, Long>{
 }