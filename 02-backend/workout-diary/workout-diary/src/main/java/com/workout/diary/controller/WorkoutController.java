package com.workout.diary.controller;


import com.workout.diary.entity.ActiveRoutine;
import com.workout.diary.entity.Workout;
import com.workout.diary.requestmodels.CompleteWorkoutRequest;
import com.workout.diary.responsemodels.ShelfCurrentActivitiesResponse;
import com.workout.diary.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"https://localhost:3000", "https://jane-workout.duckdns.org"})
@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private WorkoutService workoutService;

    @Autowired
    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @GetMapping("/secure/currentActives")
    public List<ShelfCurrentActivitiesResponse> currentActivities(@AuthenticationPrincipal Jwt jwt)
        throws Exception {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return workoutService.currentLoans(userEmail);
    }

    @GetMapping("/secure/currentActives/count")
    public int currentActivesCount(@AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return workoutService.currentActivesCount(userEmail);
    }

    @GetMapping("/secure/isActivated/byuser")
    public ActiveRoutine activeWorkoutByUser(@AuthenticationPrincipal Jwt jwt,
                                             @RequestParam Long workoutId) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return workoutService.activeWorkoutByUser(userEmail, workoutId);
    }

    @PutMapping("/secure/active")
    public Workout activeWorkout (@AuthenticationPrincipal Jwt jwt,
            @RequestParam Long workoutId,
            @RequestParam int maxSets,
            @RequestParam int maxReps) throws Exception {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return workoutService.activeWorkout(userEmail, workoutId, maxSets, maxReps);
    }

    @PutMapping("/secure/complete")
    public void completeWorkouts(@AuthenticationPrincipal Jwt jwt,
                                 @RequestBody CompleteWorkoutRequest request) throws Exception {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        workoutService.completeWorkouts(userEmail, request.getWorkoutIds(), request.getMemo());
    }

    @PutMapping("/secure/cancel")
    public void cancelWorkout(@AuthenticationPrincipal Jwt jwt,
                              @RequestParam Long workoutId) throws Exception {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        workoutService.cancelWorkout(userEmail, workoutId);
    }

}
