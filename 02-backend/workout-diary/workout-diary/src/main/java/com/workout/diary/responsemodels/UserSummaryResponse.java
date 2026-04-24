package com.workout.diary.responsemodels;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
public class UserSummaryResponse {

    @Data
    @NoArgsConstructor
    public static class TodayWorkout {
        private String title;
        private Integer actualReps;
        private Integer actualSets;

        public TodayWorkout(String title, Integer actualReps, Integer actualSets) {
            this.title = title;
            this.actualReps = actualReps;
            this.actualSets = actualSets;
        }
    }

    private int unreadMessageCount;
    private int points;
    private List<TodayWorkout> todayWorkouts;

    public UserSummaryResponse(int unreadMessageCount, int points, List<TodayWorkout> todayWorkouts) {
        this.unreadMessageCount = unreadMessageCount;
        this.points = points;
        this.todayWorkouts = todayWorkouts;
    }
}

