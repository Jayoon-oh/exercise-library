package com.workout.diary.service;

import com.workout.diary.dao.WorkoutRepository;
import com.workout.diary.entity.Workout;
import com.workout.diary.requestmodels.AddWorkoutRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class AdminService {

    private WorkoutRepository workoutRepository;

    @Autowired
    public AdminService (WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
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
}
