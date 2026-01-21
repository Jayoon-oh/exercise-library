package com.workout.diary.dao;

import com.workout.diary.entity.ActiveRoutine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActiveRoutineRepository extends JpaRepository<ActiveRoutine, Long> {

    ActiveRoutine findByUserEmailAndWorkoutId(String userEmail, Long bookId);

    List<ActiveRoutine> findWorkoutsByUserEmail(String userEmail);
}
