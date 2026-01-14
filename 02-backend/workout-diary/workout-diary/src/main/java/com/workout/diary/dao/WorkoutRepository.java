package com.workout.diary.dao;

import com.workout.diary.entity.Workout;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.JpaRepository;

@SpringBootApplication
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
}
