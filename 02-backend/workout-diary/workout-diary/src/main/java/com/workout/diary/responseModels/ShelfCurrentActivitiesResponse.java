package com.workout.diary.responseModels;

import com.workout.diary.entity.Workout;
import lombok.Data;

@Data
public class ShelfCurrentActivitiesResponse {

    public ShelfCurrentActivitiesResponse(Workout workout, int daysLeft, int maxSets, int maxReps) {
        this.workout = workout;
        this.daysLeft = daysLeft;
        this.maxSets = maxSets;
        this.maxReps = maxReps;
    }

    private Workout workout;

    private int daysLeft;

    private int maxSets;

    private int maxReps;

}
