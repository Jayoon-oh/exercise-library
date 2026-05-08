package com.workout.diary.controller;

import com.workout.diary.responsemodels.UserSummaryResponse;
import com.workout.diary.service.UserSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("https://loca" +
        "lhost:3000")
@RestController
@RequestMapping("/api/summary")
public class UserSummaryController {

    private UserSummaryService userSummaryService;

    @Autowired
    public UserSummaryController (UserSummaryService userSummaryService) {
        this.userSummaryService = userSummaryService;
    }

    @GetMapping("/secure/user-summary")
    public UserSummaryResponse userSummary(@AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return userSummaryService.userSummary(userEmail);
    }
}
