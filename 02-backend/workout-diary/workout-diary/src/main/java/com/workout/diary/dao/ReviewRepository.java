package com.workout.diary.dao;

import com.workout.diary.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByWorkoutId(@RequestParam("workout_id")Long workoutId,
                              Pageable pageable);
}
