package com.workout.diary.requestmodels;

import lombok.Data;

import java.util.Optional;

@Data
public class ReviewRequest {

    private double rating;

    private Long workoutId;


    private Optional<String> reviewDescription;
}
