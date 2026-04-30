package com.workout.diary.service;

import com.workout.diary.entity.History;
import com.workout.diary.repository.HistoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
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

    // 당월 운동 수
    public int getThisMonthCount(String userEmail) {
        // 1. thisMonth 만들고
        String thisMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        // 2. repository 호출하고
        int thisMonthCount = historyRepository.countByUserEmailAndCompletedDateLike(userEmail, thisMonth + "%");
        // 3. return
        return thisMonthCount;
    }

    public List<Integer> getMonthlyCount(String userEmail) {
        List<Integer> result = new ArrayList<>();

        for (int i = 0; i < 6; i++) {
            String month = LocalDate.now().minusMonths(i)
                    .format(DateTimeFormatter.ofPattern("yyyy-MM"));

            int count = historyRepository.countByUserEmailAndCompletedDateLike(userEmail, month + "%");
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
    public List<History> getWorkoutHistory(String userEmail, String completedDate) {
        return historyRepository.findByUserEmailAndCompletedDate(userEmail, completedDate);
    }

    // completed workout list per month (for checking Calendar ex.Apr, May)
    public List<String> getWorkoutHistoryByMonth(String userEmai, String yearMonth) {
        return historyRepository.findByCompletedDatesByUserEmailAndMonth(userEmai, yearMonth);
    }
}