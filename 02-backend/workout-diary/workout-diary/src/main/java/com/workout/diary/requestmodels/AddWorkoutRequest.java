package com.workout.diary.requestmodels;

import lombok.Data;

@Data
public class AddWorkoutRequest {

    private String title;

    private String source;

    private String description;

    private int recommendedSets;

    private String muscleGroup;

    private String img;

}
