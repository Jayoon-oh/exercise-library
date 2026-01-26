package com.workout.diary.dao;

import com.workout.diary.entity.Workout;
import org.hibernate.annotations.ParamDef;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@SpringBootApplication
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    Page<Workout> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);

    Page<Workout> findByMuscleGroup(@RequestParam("muscleGroup") String muscleGroup, Pageable pageable);

    @Query("select a from Workout a where id in :workout_ids")
    List<Workout> findWorkoutsByWorkoutIds (@Param("workout_ids") List<Long> workoutId);
}
