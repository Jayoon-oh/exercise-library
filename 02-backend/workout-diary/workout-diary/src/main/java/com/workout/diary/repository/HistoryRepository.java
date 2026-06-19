package com.workout.diary.repository;

import com.workout.diary.entity.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {
    Page<History> findByUserEmail(@RequestParam("userEmail") String userEmail, Pageable pageable);

    int countByUserEmailAndCompletedDateBetween(String userEmail, LocalDate startDate, LocalDate completedDate);

    @Query("SELECT h.muscleGroup, COUNT(h) FROM History h " +
            "WHERE h.userEmail = :userEmail " +
            "GROUP BY h.muscleGroup")
    List<Object[]> countByMuscleGroup(@Param("userEmail") String userEmail);

    // workout list for specific Date on Calendar
    List<History> findByUserEmailAndCompletedDate(String userEmail, LocalDate completedDate);

    // completed workout list per month (for checking Calendar ex.Apr, May)
    @Query("SELECT DISTINCT h.completedDate FROM History h WHERE h.userEmail = :userEmail AND h.completedDate BETWEEN :startDate AND :endDate")
    List<LocalDate> findByCompletedDatesByUserEmailAndMonth(@Param("userEmail") String userEmail, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // recent memo at TodayRoutineSummary
    @Query("SELECT h FROM History h WHERE h.userEmail = :userEmail AND h.workoutMemo IS NOT NULL ORDER BY h.completedDate DESC")
    List<History> findRecentMemosWithLimit(@Param("userEmail") String userEmail, Pageable pageable);
}
