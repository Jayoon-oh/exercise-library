package com.workout.diary.repository;

import com.workout.diary.entity.ActiveRoutine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ActiveRoutineRepository extends JpaRepository<ActiveRoutine, Long> {

    ActiveRoutine findByUserEmailAndWorkoutId(String userEmail, Long bookId);

    List<ActiveRoutine> findWorkoutsByUserEmail(String userEmail);

    // select for Multiple workouts (shelfCurrentWorkouts)
    @Query("SELECT a FROM ActiveRoutine a WHERE a.userEmail = :userEmail AND a.workoutId IN :workoutIds")
    List<ActiveRoutine> findByUserEmailAndWorkoutIds(@Param("userEmail") String userEmail, @Param("workoutIds") List<Long> workoutIds);

    @Modifying
    @Query("delete from ActiveRoutine a where a.workoutId in :workout_id")
    void deletedAllByWorkoutId(@Param("workout_id") Long workoutId);
}
