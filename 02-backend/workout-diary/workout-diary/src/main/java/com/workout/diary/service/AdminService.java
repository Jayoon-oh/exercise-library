package com.workout.diary.service;

import com.workout.diary.dao.ActiveRoutineRepository;
import com.workout.diary.dao.ReviewRepository;
import com.workout.diary.dao.WorkoutRepository;
import com.workout.diary.entity.Workout;
import com.workout.diary.requestmodels.AddWorkoutRequest;
import com.workout.diary.requestmodels.UpdateWorkoutRequest;
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


    public void postWorkout(AddWorkoutRequest addWorkoutRequest) {
        Workout workout = new Workout();
        workout.setTitle(addWorkoutRequest.getTitle());
        workout.setSource(addWorkoutRequest.getSource());
        workout.setDescription(addWorkoutRequest.getDescription());
        workout.setRecommendedSets(addWorkoutRequest.getRecommendedSets());
        workout.setMuscleGroup(addWorkoutRequest.getMuscleGroup());
        workout.setImg(addWorkoutRequest.getImg());
        workoutRepository.save(workout);
    }

    public void updateWorkout(UpdateWorkoutRequest updateWorkoutRequest) throws Exception {

        // 1. find existing workouts
        Workout workout = workoutRepository.findById(updateWorkoutRequest.getId())
                .orElseThrow(() -> new Exception("cannot find existing workouts" + updateWorkoutRequest.getId()));

        // 2. modify information of workouts
        workout.setTitle(updateWorkoutRequest.getTitle());
        workout.setSource(updateWorkoutRequest.getSource());
        workout.setDescription(updateWorkoutRequest.getDescription());
        workout.setMuscleGroup(updateWorkoutRequest.getMuscleGroup());
        workout.setImg(updateWorkoutRequest.getImg());

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
