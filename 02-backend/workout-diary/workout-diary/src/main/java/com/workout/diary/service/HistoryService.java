package com.workout.diary.service;

import com.workout.diary.entity.History;
import com.workout.diary.repository.HistoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class HistoryService {
    private HistoryRepository historyRepository;

    @Autowired
    public HistoryService(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    public Page<History> getUserHistories(String userEmail, Pageable pageable) {
        return historyRepository.findByUserEmail(userEmail, pageable);
    }

    // 당월 운동 수
    public int getThisMonthCount(String userEmail) {
        // 1. thisMonth 만들고
        LocalDate start = LocalDate.now().withDayOfMonth(1);
        LocalDate end = start.plusMonths(1).minusDays(1);
        // 2. repository 호출하고
        int thisMonthCount = historyRepository.countByUserEmailAndCompletedDateBetween(userEmail, start, end);
        // 3. return
        return thisMonthCount;
    }

    public List<Integer> getMonthlyCount(String userEmail) {
        List<Integer> result = new ArrayList<>();

        for (int i = 0; i < 6; i++) {
            LocalDate start = LocalDate.now().minusMonths(i).withDayOfMonth(1);
            LocalDate end = start.plusMonths(1).minusDays(1);

            int count = historyRepository.countByUserEmailAndCompletedDateBetween(userEmail, start , end);
            result.add(count);
        }
        return result;
    }

    public Map<String, Long> getMuscleGroupCount(String userEmail) {
        List<Object[]> results = historyRepository.countByMuscleGroup(userEmail);
        Map<String, Long> muscleGroupMap = new HashMap<>();

        for (Object[] row : results) {
            String muscleGroup = (String) row[0];
            Long count = (Long) row[1];
            muscleGroupMap.put(muscleGroup, count);
        }
        return muscleGroupMap;
    }

    //workout list for specific Date on Calendar
    public List<History> getWorkoutHistory(String userEmail, LocalDate completedDate) {
        return historyRepository.findByUserEmailAndCompletedDate(userEmail, completedDate);
    }

    // completed workout list per month (for checking Calendar ex.Apr, May)
    public List<String> getWorkoutHistoryByMonth(String userEmail, LocalDate startDate, LocalDate endDate) {
        return historyRepository.findByCompletedDatesByUserEmailAndMonth(userEmail, startDate, endDate);
    }
}