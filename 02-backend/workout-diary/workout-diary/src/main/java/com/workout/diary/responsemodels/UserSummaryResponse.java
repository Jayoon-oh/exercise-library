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
        private String img;

        public TodayWorkout(String title, Integer actualReps, Integer actualSets, String img) {
            this.title = title;
            this.actualReps = actualReps;
            this.actualSets = actualSets;
            this.img = img;
        }
    }

    private int unreadMessageCount;
    private int points;
    private List<TodayWorkout> todayWorkouts;
    private int todayRoutineCount;

    public UserSummaryResponse(int unreadMessageCount, int points, List<TodayWorkout> todayWorkouts, int todayRoutineCount) {
        this.unreadMessageCount = unreadMessageCount;
        this.points = points;
        this.todayWorkouts = todayWorkouts;
        this.todayRoutineCount = todayRoutineCount;
    }
}

