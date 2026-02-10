package com.workout.diary.requestmodels;

import lombok.Data;

@Data
public class UpdateWorkoutRequest {

    private Long id;

    private String title;

    private String source;

    private String description;

    private String muscleGroup;

    private String img;
}
