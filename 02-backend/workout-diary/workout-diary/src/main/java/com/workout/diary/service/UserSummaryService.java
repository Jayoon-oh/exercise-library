package com.workout.diary.service;

import com.workout.diary.entity.ActiveRoutine;
import com.workout.diary.entity.History;
import com.workout.diary.entity.UserPoints;
import com.workout.diary.entity.Workout;
import com.workout.diary.repository.*;
import com.workout.diary.responsemodels.ShelfCurrentActivitiesResponse;
import com.workout.diary.responsemodels.UserSummaryResponse;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class UserSummaryService {

    private MessageRepository messageRepository;
    private UserPointsRepository userPointsRepository;
    private ActiveRoutineRepository activeRoutineRepository;
    private WorkoutRepository workoutRepository;

    public UserSummaryService(MessageRepository messageRepository, UserPointsRepository userPointsRepository, ActiveRoutineRepository activeRoutineRepository,
                              WorkoutRepository workoutRepository) {
        this.messageRepository = messageRepository;
        this.userPointsRepository = userPointsRepository;
        this.activeRoutineRepository = activeRoutineRepository;
        this.workoutRepository = workoutRepository;
    }

    public UserSummaryResponse userSummary (String userEmail) {
        // 1. count unread messages
        int unreadCount = messageRepository.countByUserEmailAndClosedAndIsRead(userEmail, true, false);

        // 2. total Points
        UserPoints userPoints = userPointsRepository.findByUserEmail(userEmail);
        int points = userPoints.getTotalPoints();

        // 3. to do workout list for the day
        List<ActiveRoutine> activeRoutines = activeRoutineRepository.findWorkoutsByUserEmail(userEmail);
        List<Long> workoutIdList = new ArrayList<>();
        for (ActiveRoutine routine : activeRoutines) {
            workoutIdList.add(routine.getWorkoutId());
        }
        List<Workout> workouts = workoutRepository.findWorkoutsByWorkoutIds(workoutIdList);

        // 4. make TodayWorkout list
        List<UserSummaryResponse.TodayWorkout> todayWorkouts = new ArrayList<>();
        for (ActiveRoutine routine : activeRoutines) {
            // find Workout by workout_id
            Workout workout = workouts.stream()
                    .filter(w -> w.getId() == routine.getWorkoutId()) // identify with ids
                    .findFirst() // find first
                    .orElse(null); // if it's not existed return null

            if (workout != null) {
                todayWorkouts.add(
                        new UserSummaryResponse.TodayWorkout(
                                workout.getTitle(),
                                routine.getMaxReps(),
                                routine.getMaxSets(),
                                workout.getImg()
                        )
                );
            }
        }

        return new UserSummaryResponse(unreadCount, points, todayWorkouts, todayWorkouts.size());
    }
}
