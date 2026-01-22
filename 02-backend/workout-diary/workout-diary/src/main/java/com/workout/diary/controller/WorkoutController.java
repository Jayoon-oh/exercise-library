package com.workout.diary.controller;


import com.workout.diary.entity.Workout;
import com.workout.diary.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private WorkoutService workoutService;

    @Autowired
    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @GetMapping("/secure/currentActives/count")
    public int currentActivesCount(@AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getClaim("http://exercise-library.com/email");
        return workoutService.currentActivesCount(userEmail);
    }

    @GetMapping("/secure/isActivated/byuser")
    public boolean activeWorkoutByUser(@AuthenticationPrincipal Jwt jwt,
            @RequestParam Long workoutId) {
        String userEmail = jwt.getClaim("http://exercise-library.com/email");
        return workoutService.activeWorkoutByUser(userEmail, workoutId);
    }

    @PutMapping("/secure/active")
    public Workout activeWorkout (@AuthenticationPrincipal Jwt jwt,
            @RequestParam Long workoutId) throws Exception {
        String userEmail = jwt.getClaim("http://exercise-library.com/email");
        return workoutService.activeWorkout(userEmail, workoutId);
    }
}
