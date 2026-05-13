package com.workout.diary.controller;

import com.workout.diary.entity.Review;
import com.workout.diary.requestmodels.ReviewRequest;
import com.workout.diary.service.ReviewService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"https://localhost:3000", "https://jane-workout.duckdns.org"})
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private ReviewService reviewService;

    public ReviewController (ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PutMapping("/secure/update/review")
    public void updateReview(@AuthenticationPrincipal Jwt jwt,
                             @RequestBody ReviewRequest reviewRequest) throws Exception {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");

        if(userEmail == null) {
            throw new Exception("User email is missing");
        }

        reviewService.updateReview(userEmail, reviewRequest);
    }

    @DeleteMapping("/secure/delete/review")
    public void deleteMessage(@AuthenticationPrincipal Jwt jwt,
                              @RequestParam Long reviewId) throws Exception {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        reviewService.deleteReview(userEmail, reviewId);
    }

    @GetMapping("/secure/user/workout")
    public Boolean reviewWorkoutByUser(@AuthenticationPrincipal Jwt jwt,
                                       @RequestParam Long workoutId) throws Exception {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");

        if(userEmail == null) {
            throw new Exception("User email is missing");
        }
        return reviewService.userReviewListed(userEmail, workoutId);
    }

    @PostMapping("/secure")
    public void postReview(@AuthenticationPrincipal Jwt jwt,
                           @RequestBody ReviewRequest reviewRequest) throws Exception {
        String userEmail = jwt.getClaim("https://exercise-library.com/email");
        if (userEmail == null) {
            throw new Exception("User email is missing");
        }
        reviewService.postReview(userEmail, reviewRequest);
    }
}
