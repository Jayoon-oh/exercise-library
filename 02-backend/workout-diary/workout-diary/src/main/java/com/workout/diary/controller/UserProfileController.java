package com.workout.diary.controller;

import com.workout.diary.entity.BodyRecord;
import com.workout.diary.entity.UserProfile;
import com.workout.diary.repository.UserProfileRepository;
import com.workout.diary.requestmodels.BodyRecordRequest;
import com.workout.diary.requestmodels.UserProfileRequest;
import com.workout.diary.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/profiles")
public class UserProfileController {

    private UserProfileService userProfileService;

    @Autowired
    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping("/secure/saveProfile")
    public void saveProfile(@AuthenticationPrincipal Jwt jwt,
                            @RequestBody UserProfileRequest userProfileRequest) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        userProfileService.saveProfile(userEmail, userProfileRequest);
    }

    @GetMapping("/secure/profile")
    public UserProfile getProfile(@AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return userProfileService.getProfile(userEmail);
    }

    @PostMapping("/secure/bodyRecord")
    public void addBodyRecord(@AuthenticationPrincipal Jwt jwt, @RequestBody BodyRecordRequest bodyRecordRequest) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        userProfileService.addBodyRecord(userEmail, bodyRecordRequest);
    }

    @GetMapping("secure/bodyRecords")
    public List<BodyRecord> getBodyRecords(@AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        return userProfileService.getBodyRecords(userEmail);
    }
}
