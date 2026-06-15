package com.workout.diary.repository;

import com.workout.diary.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    UserProfile findByUserEmail(String userEmail);

    boolean existsByUserEmail(String userEmail);
}
