package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.NotificationToUser;



@Repository
public interface NotificationToUserRepository extends JpaRepository<NotificationToUser, Long> {
   

}
