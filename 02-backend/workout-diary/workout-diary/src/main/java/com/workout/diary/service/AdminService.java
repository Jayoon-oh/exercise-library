package com.workout.diary.service;

import com.workout.diary.dao.ActiveRoutineRepository;
import com.workout.diary.dao.ReviewRepository;
import com.workout.diary.dao.WorkoutRepository;
import com.workout.diary.entity.Workout;
import com.workout.diary.requestmodels.AddWorkoutRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class AdminService {

    private WorkoutRepository workoutRepository;
    private ReviewRepository reviewRepository;
    private ActiveRoutineRepository activeRoutineRepository;

    @Autowired
    public AdminService (WorkoutRepository workoutRepository,
                         ReviewRepository reviewRepository,
                         ActiveRoutineRepository activeRoutineRepository) {
        this.workoutRepository = workoutRepository;
        this.reviewRepository = reviewRepository;
        this.activeRoutineRepository = activeRoutineRepository;
    }

    public void increaseWorkoutSlots(Long workoutId) throws Exception {
        Optional<Workout> workout = workoutRepository.findById(workoutId);

            if (!workout.isPresent()) {
                throw new Exception("Workout not found");
            }

            workout.get().setSlotsAvailable(workout.get().getSlotsAvailable() + 1);
            workout.get().setSlots(workout.get().getSlots() + 1);

            workoutRepository.save(workout.get());
        }

    public void decreaseWorkoutSlots(Long workoutId) throws Exception {
        Optional<Workout> workout = workoutRepository.findById(workoutId);

        if (!workout.isPresent() || workout.get().getSlotsAvailable() <= 0 || workout.get().getSlots() <= 0) {
            throw new Exception("Workout not found or quantity locked");
        }

        workout.get().setSlotsAvailable(workout.get().getSlotsAvailable() - 1);
        workout.get().setSlots(workout.get().getSlots() - 1);

        workoutRepository.save(workout.get());
    }

    public void postWorkout(AddWorkoutRequest addWorkoutRequest) {
        Workout workout = new Workout();
        workout.setTitle(addWorkoutRequest.getTitle());
        workout.setSource(addWorkoutRequest.getSource());
        workout.setDescription(addWorkoutRequest.getDescription());
        workout.setSlots(addWorkoutRequest.getSlots());
        workout.setSlotsAvailable(addWorkoutRequest.getSlots());
        workout.setMuscleGroup(addWorkoutRequest.getMuscleGroup());
        workout.setImg(addWorkoutRequest.getImg());
        workoutRepository.save(workout);
    }

    public void deleteWorkout(Long workoutId) throws Exception {

        Optional<Workout> workout = workoutRepository.findById(workoutId);

        if (!workout.isPresent()) {
            throw new Exception("Workout not found");
        }
            workoutRepository.delete(workout.get());
            activeRoutineRepository.deletedAllByWorkoutId(workoutId);
            workoutRepository.delete(workout.get());
    }
}
