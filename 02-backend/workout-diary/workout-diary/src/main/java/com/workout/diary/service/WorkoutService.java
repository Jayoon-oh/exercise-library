package com.workout.diary.service;

import com.workout.diary.dao.ActiveRoutineRepository;
import com.workout.diary.dao.HistoryRepository;
import com.workout.diary.dao.WorkoutRepository;
import com.workout.diary.entity.ActiveRoutine;
import com.workout.diary.entity.History;
import com.workout.diary.entity.Workout;
import com.workout.diary.responseModels.ShelfCurrentActivitiesResponse;
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

    public WorkoutService(WorkoutRepository workoutRepository, ActiveRoutineRepository activeRoutineRepository, HistoryRepository historyRepository) {
        this.workoutRepository = workoutRepository;
        this.activeRoutineRepository = activeRoutineRepository;
        this.historyRepository = historyRepository;
    }

    public Workout activeWorkout (String userEmail, Long workoutId, int maxSets, int maxReps) throws Exception {
        Optional<Workout> workout = workoutRepository.findById(workoutId);

        ActiveRoutine validateActive = activeRoutineRepository.findByUserEmailAndWorkoutId(userEmail, workoutId);

        if (!workout.isPresent() || validateActive != null || workout.get().getSlotsAvailable() <= 0) {
            throw new Exception("Workout doesn't exist or already Activated by user");
        }

        workout.get().setSlotsAvailable(workout.get().getSlotsAvailable() - 1);
        workoutRepository.save(workout.get());

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
                Optional<ActiveRoutine> ActiveRoutine = activeRoutineList.stream()
                        .filter(x -> x.getWorkoutId() == workout.getId()).findFirst();

                if (ActiveRoutine.isPresent()) {
                    Date d1 = sdf.parse(ActiveRoutine.get().getEndDate());
                    Date d2 = sdf.parse(LocalDate.now().toString());

                    TimeUnit time = TimeUnit.DAYS;

                    long difference_In_time = time.convert(d1.getTime() - d2.getTime(),
                            TimeUnit.MILLISECONDS);

                    shelfCurrentActivitiesResponses.add(new ShelfCurrentActivitiesResponse(workout, (int) difference_In_time));
                }
            }
            return shelfCurrentActivitiesResponses;
        }

        public void cancelWorkout (String userEmail, Long workoutId) throws Exception {
            Optional<Workout> workout = workoutRepository.findById(workoutId);

            ActiveRoutine validateActive = activeRoutineRepository.findByUserEmailAndWorkoutId(userEmail, workoutId);

            if (!workout.isPresent() || validateActive == null) {
                throw new Exception("Workout doesn't exist or not checked out by user");
            }

            workout.get().setSlotsAvailable(workout.get().getSlotsAvailable() + 1);

            workoutRepository.save(workout.get());
            activeRoutineRepository.deleteById(validateActive.getId());

            History history = new History(
                    userEmail,
                    validateActive.getStartDate(),
                    LocalDate.now().toString(),
                    workout.get().getTitle(),
                    workout.get().getSource(),
                    workout.get().getDescription(),
                    workout.get().getImg()
            );

            historyRepository.save(history);
        }

        public void extendDays(String userEmail, Long workoutId) throws Exception {
            ActiveRoutine validateActive = activeRoutineRepository.findByUserEmailAndWorkoutId(userEmail, workoutId);

            if (validateActive  == null) {
                throw new Exception("Workout does not exist or not checked out by user");
            }

            SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd");

            Date d1 = sdFormat.parse(validateActive.getEndDate());
            Date d2 = sdFormat.parse(validateActive.getStartDate());

            if (d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0) {
                validateActive.setEndDate(LocalDate.now().plusDays(7).toString());
                activeRoutineRepository.save(validateActive);
            }
        }


    }

