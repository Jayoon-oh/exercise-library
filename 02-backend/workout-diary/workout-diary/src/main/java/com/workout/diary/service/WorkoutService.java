package com.workout.diary.service;

import com.workout.diary.dao.ActiveRoutineRepository;
import com.workout.diary.dao.WorkoutRepository;
import com.workout.diary.entity.ActiveRoutine;
import com.workout.diary.entity.Workout;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
public class WorkoutService {

    private WorkoutRepository workoutRepository;
    private ActiveRoutineRepository activeRoutineRepository;

    public WorkoutService(WorkoutRepository workoutRepository, ActiveRoutineRepository activeRoutineRepository) {
        this.workoutRepository = workoutRepository;
        this.activeRoutineRepository = activeRoutineRepository;
    }

    public Workout activeWorkout (String userEmail, Long workoutId) throws Exception {
        Optional<Workout> workout = workoutRepository.findById(workoutId);

        ActiveRoutine validateActive = activeRoutineRepository.findByUserEmailAndWorkoutId(userEmail, workoutId);

        if (!workout.isPresent() || validateActive != null || workout.get().getSlotsAvailable() <= 0) {
            throw new Exception("Workout doesn't exist or already Activated by user");
        }

        workout.get().setSlotsAvailable(workout.get().getSlotsAvailable() - 1);
        workoutRepository.save(workout.get());

        ActiveRoutine activeRoutine = new ActiveRoutine(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                workout.get().getId()
        );

        activeRoutineRepository.save(activeRoutine);

        return workout.get();
    }
}
