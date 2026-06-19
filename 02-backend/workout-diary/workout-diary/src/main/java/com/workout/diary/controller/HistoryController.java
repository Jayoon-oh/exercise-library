package com.workout.diary.controller;

import com.workout.diary.entity.History;
import com.workout.diary.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"https://localhost:3000", "https://jane-workout.duckdns.org"})
@RestController
@RequestMapping("/api/histories")
public class HistoryController {

    private HistoryService historyService;

    @Autowired
    public HistoryController(HistoryService historyService) {
        this.historyService= historyService;
    }

    @GetMapping("/secure/workoutHistories")
    public Page<History> getUserHistories(@AuthenticationPrincipal Jwt jwt, Pageable pageable) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return historyService.getUserHistories(userEmail, pageable);
    }

    @GetMapping("/secure/thisMonthCount")
    public int getThisMonthCount(@AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return historyService.getThisMonthCount(userEmail);
    }

    @GetMapping("/secure/MonthlyCount")
    public List<Integer> getMonthlyCount(@AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return historyService.getMonthlyCount(userEmail);
    }

    @GetMapping("/secure/MuscleGroupCount")
    public Map<String, Long> getMuscleGroupCount(@AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return historyService.getMuscleGroupCount(userEmail);
    }

    @GetMapping("/secure/WorkoutCalendar")
    public List<History> getWorkoutHistory(@AuthenticationPrincipal Jwt jwt, @RequestParam LocalDate completedDate) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return historyService.getWorkoutHistory(userEmail, completedDate);
    }

    @GetMapping("/secure/WorkoutCalendar/Month")
    public List<LocalDate> getWorkoutHistoryByRange(@AuthenticationPrincipal Jwt jwt, @RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return historyService.getWorkoutHistoryByMonth(userEmail, startDate, endDate);
    }
}
