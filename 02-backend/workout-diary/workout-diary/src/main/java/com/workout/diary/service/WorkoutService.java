package com.workout.diary.service;

import com.workout.diary.constants.PointsConstants;
import com.workout.diary.repository.*;
import com.workout.diary.entity.ActiveRoutine;
import com.workout.diary.entity.History;
import com.workout.diary.entity.Workout;
import com.workout.diary.requestmodels.CompleteWorkoutRequest;
import com.workout.diary.responsemodels.ShelfCurrentActivitiesResponse;
import exception.ActivatedRoutineNotFoundException;
import exception.AlreadyActivatedException;
import exception.WorkoutNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


@Service
@Transactional
public class WorkoutService {
    private static final int ROUTINE_DURATION_DAYS = 7;

    private WorkoutRepository workoutRepository;
    private ActiveRoutineRepository activeRoutineRepository;
    private HistoryRepository historyRepository;
    private PointsService pointsService;

    public WorkoutService(WorkoutRepository workoutRepository, ActiveRoutineRepository activeRoutineRepository, HistoryRepository historyRepository
    ,PointsService pointsService) {
        this.workoutRepository = workoutRepository;
        this.activeRoutineRepository = activeRoutineRepository;
        this.historyRepository = historyRepository;
        this.pointsService = pointsService;
    }

    public Workout activeWorkout (String userEmail, Long workoutId, int maxSets, int maxReps) {

        Optional<Workout> workout = workoutRepository.findById(workoutId);

        ActiveRoutine existingRoutine = activeRoutineRepository.findByUserEmailAndWorkoutId(userEmail, workoutId);

        if (!workout.isPresent()) {
            throw new WorkoutNotFoundException("Workout doesn't exist");
        }

        if ( existingRoutine != null) {
            throw new AlreadyActivatedException("Workout is already Activated by user");
        }

        ActiveRoutine activeRoutine = new ActiveRoutine(
                userEmail,
                LocalDate.now(),
                LocalDate.now().plusDays(ROUTINE_DURATION_DAYS),
                workout.get().getId(),
                maxSets,
                maxReps
        );

        activeRoutineRepository.save(activeRoutine);

        return workout.get();
    }

    public ActiveRoutine activeWorkoutByUser(String userEmail, Long workoutId) {
        return activeRoutineRepository.findByUserEmailAndWorkoutId(userEmail, workoutId);
    }

        public int currentActivesCount(String userEmail) {
            return activeRoutineRepository.findWorkoutsByUserEmail(userEmail).size();
        }

        public List<ShelfCurrentActivitiesResponse> currentLoans(String userEmail) throws Exception {

            List<ShelfCurrentActivitiesResponse> shelfCurrentActivitiesResponses = new ArrayList<>();

            List<ActiveRoutine> activeRoutineList = activeRoutineRepository.findWorkoutsByUserEmail(userEmail);
            List<Long> workoutIdList = new ArrayList<>();

            for (ActiveRoutine i: activeRoutineList) {
                workoutIdList.add(i.getWorkoutId());
            }

            List<Workout> workouts = workoutRepository.findWorkoutsByWorkoutIds(workoutIdList);

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            for (Workout workout : workouts) {
                Optional<ActiveRoutine> activeRoutine = activeRoutineList.stream()
                        .filter(x -> x.getWorkoutId() == workout.getId()).findFirst();

                if (activeRoutine.isPresent()) {
                    LocalDate endDate = activeRoutine.get().getEndDate();
                    LocalDate today = LocalDate.now();

                    TimeUnit time = TimeUnit.DAYS;

                    long daysLeft = ChronoUnit.DAYS.between(today, endDate);

                    shelfCurrentActivitiesResponses.add(new ShelfCurrentActivitiesResponse(
                            workout,
                            (int)daysLeft,
                            activeRoutine.get().getMaxSets(),
                            activeRoutine.get().getMaxReps()

                    ));
                }
            }
            return shelfCurrentActivitiesResponses;
        }

        public void completeWorkouts(String userEmail, List<Long> workoutIds, String memo, Integer actualReps, Integer actualSets) {
            List<ActiveRoutine> activeRoutines = activeRoutineRepository.findByUserEmailAndWorkoutIds(userEmail, workoutIds);

            if (activeRoutines.isEmpty()) {
                throw new ActivatedRoutineNotFoundException("Cannot find ActivatedRoutine");
            }

            List<History> historyList = new ArrayList<>();

            List<Long> ids = activeRoutines.stream()
                    .map(routine -> routine.getWorkoutId())
                    .collect(Collectors.toList());

            Map<Long, Workout> workoutMap = workoutRepository.findAllById(ids)
                    .stream()
                    .collect(Collectors.toMap(Workout::getId, w -> w));

            for (ActiveRoutine routine : activeRoutines) {
                // loading workoutIds
                Workout workout = workoutMap.get(routine.getWorkoutId());

                if (workout == null) {
                    throw new WorkoutNotFoundException("Cannot find workoutId: " + routine.getWorkoutId());
                }

                History history = new History(
                        userEmail,
                        routine.getStartDate(),
                        LocalDate.now(),
                        workout.getTitle(),
                        workout.getSource(),
                        workout.getDescription(),
                        workout.getImg(),
                        actualReps,
                        actualSets,
                        routine.getMaxReps(),
                        routine.getMaxSets(),
                        workout.getMuscleGroup(),
                        memo
                );
                historyList.add(history);
            }
            historyRepository.saveAll(historyList);

            pointsService.addPoints(userEmail, PointsConstants.WORKOUT_COMPLETE_POINTS, PointsConstants.WORKOUT_COMPLETE_MSG);
        }

        public void cancelWorkout (String userEmail, Long workoutId) throws Exception {
            Optional<Workout> workout = workoutRepository.findById(workoutId);

            ActiveRoutine validateActive = activeRoutineRepository.findByUserEmailAndWorkoutId(userEmail, workoutId);

            if (!workout.isPresent() || validateActive == null) {
                throw new Exception("Workout doesn't exist or not checked out by user");
            }

            activeRoutineRepository.deleteById(validateActive.getId());

        }

    }

