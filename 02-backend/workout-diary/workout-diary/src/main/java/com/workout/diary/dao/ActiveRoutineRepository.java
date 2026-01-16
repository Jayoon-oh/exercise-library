package com.workout.diary.dao;

import com.workout.diary.entity.ActiveRoutine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActiveRoutineRepository extends JpaRepository<ActiveRoutine, Long> {

    ActiveRoutine findByUserEmailAndWorkoutId(String userEmail, Long bookId);
}
