package com.workout.diary.controller;

import com.workout.diary.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/histories")
public class HistoryController {

    private HistoryService historyService;

    @Autowired
    public HistoryController(HistoryService historyService) {
        this.historyService= historyService;
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
}
