package com.workout.diary.service;

import com.workout.diary.constants.PointsConstants;
import com.workout.diary.repository.*;
import com.workout.diary.entity.ActiveRoutine;
import com.workout.diary.entity.History;
import com.workout.diary.entity.Workout;
import com.workout.diary.requestmodels.CompleteWorkoutRequest;
import com.workout.diary.responsemodels.ShelfCurrentActivitiesResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class WorkoutService {

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

    public Workout activeWorkout (String userEmail, Long workoutId, int maxSets, int maxReps) throws Exception {
        Optional<Workout> workout = workoutRepository.findById(workoutId);

        ActiveRoutine validateActive = activeRoutineRepository.findByUserEmailAndWorkoutId(userEmail, workoutId);

        if (!workout.isPresent() || validateActive != null) {
            throw new Exception("Workout doesn't exist or already Activated by user");
        }

        ActiveRoutine activeRoutine = new ActiveRoutine(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
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
                    Date d1 = sdf.parse(activeRoutine.get().getEndDate());
                    Date d2 = sdf.parse(LocalDate.now().toString());

                    TimeUnit time = TimeUnit.DAYS;

                    long difference_In_time = time.convert(d1.getTime() - d2.getTime(),
                            TimeUnit.MILLISECONDS);

                    shelfCurrentActivitiesResponses.add(new ShelfCurrentActivitiesResponse(
                            workout,
                            (int) difference_In_time,
                            activeRoutine.get().getMaxSets(),
                            activeRoutine.get().getMaxReps()

                    ));
                }
            }
            return shelfCurrentActivitiesResponses;
        }

        public void completeWorkouts(String userEmail, List<Long> workoutIds, String memo) throws Exception {
            List<ActiveRoutine> activeRoutines = activeRoutineRepository.findByUserEmailAndWorkoutIds(userEmail, workoutIds);

            if (activeRoutines.isEmpty()) {
                throw new Exception("Cannot find ActivatedRoutine");
            }

            List<History> historyList = new ArrayList<>();

            for (ActiveRoutine routine : activeRoutines) {
                // loading workoutIds
                Workout workout = workoutRepository.findById(routine.getWorkoutId())
                        .orElseThrow(() -> new Exception("Cannot find WorkoutId. ID: " + routine.getWorkoutId()));

                History history = new History(
                        userEmail,
                        routine.getStartDate(),
                        LocalDate.now().toString(),
                        workout.getTitle(),
                        workout.getSource(),
                        workout.getDescription(),
                        workout.getImg(),
                        routine.getMaxReps(),
                        routine.getMaxSets(),
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

