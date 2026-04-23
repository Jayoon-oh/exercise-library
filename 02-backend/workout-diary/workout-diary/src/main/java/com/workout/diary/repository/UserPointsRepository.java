package com.workout.diary.repository;

import com.workout.diary.entity.UserPoints;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPointsRepository extends JpaRepository<UserPoints, Long> {
    UserPoints findByUserEmail(String userEmail);
}
