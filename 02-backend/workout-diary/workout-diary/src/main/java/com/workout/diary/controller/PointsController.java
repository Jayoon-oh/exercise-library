package com.workout.diary.controller;

import com.workout.diary.entity.PointsHistory;
import com.workout.diary.entity.UserPoints;
import com.workout.diary.service.PointsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.awt.*;

@CrossOrigin(origins = {"https://localhost:3000", "https://jane-workout.duckdns.org"})
@RestController
@RequestMapping("/api/points")
public class PointsController {

    private PointsService pointsService;

    @Autowired
    public PointsController(PointsService pointsService) {
        this.pointsService = pointsService;
    }

    @GetMapping("/secure/search/points")
    public UserPoints getUserPoints(@AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return pointsService.getUserPoints(userEmail);
    }

    @GetMapping("/secure/search/userPoints")
    public List<PointsHistory> getPoints(@AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return pointsService.getPointsHistory(userEmail);
    }

}
