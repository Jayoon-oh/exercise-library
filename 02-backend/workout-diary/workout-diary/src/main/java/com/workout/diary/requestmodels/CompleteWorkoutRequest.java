package com.workout.diary.requestmodels;

import lombok.Data;

import java.util.List;

@Data
public class CompleteWorkoutRequest {

    private List<Long> workoutIds;

    private String memo;
}
