package com.workout.diary.controller;

import com.workout.diary.requestmodels.AddWorkoutRequest;
import com.workout.diary.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PutMapping("/secure/increase/workout/slots")
    public void increaseWorkoutSlots(@AuthenticationPrincipal Jwt jwt,
                                @RequestParam Long workoutId) throws Exception {
        List<String> roles = jwt.getClaimAsStringList("https://exercise-library.com/roles");
        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;

        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.increaseWorkoutSlots(workoutId);
    }

    @PutMapping("/secure/decrease/workout/slots")
    public void decreaseWorkoutSlots(@AuthenticationPrincipal Jwt jwt,
                                @RequestParam Long workoutId) throws Exception {
        List<String> roles = jwt.getClaimAsStringList("https://exercise-library.com/roles");
        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;

        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.increaseWorkoutSlots(workoutId);
    }


    @PostMapping("/secure/add/workout")
    public void postWorkout(@AuthenticationPrincipal Jwt jwt,
                            @RequestBody AddWorkoutRequest addWorkoutRequest) throws Exception{
        List<String> roles = jwt.getClaimAsStringList("https://exercise-library.com/roles");
        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;

        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.postWorkout(addWorkoutRequest);
    }

    @DeleteMapping("/secure/delete/workout")
    public void deleteWorkout(@AuthenticationPrincipal Jwt jwt,
                            @RequestParam Long workoutId) throws Exception{
        List<String> roles = jwt.getClaimAsStringList("https://exercise-library.com/roles");
        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;

        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.deleteWorkout(workoutId);
    }
}
