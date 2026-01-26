package com.workout.diary.responseModels;

import com.workout.diary.entity.Workout;
import lombok.Data;

@Data
public class ShelfCurrentActivitiesResponse {

    public ShelfCurrentActivitiesResponse(Workout workout, int daysLeft) {
        this.workout = workout;
        this.daysLeft = daysLeft;
    }

    private Workout workout;

    private int daysLeft;
}
