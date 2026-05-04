package com.workout.diary.repository;

import com.workout.diary.entity.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {
    Page<History> findByUserEmail(@RequestParam("userEmail") String userEmail, Pageable pageable);

    int countByUserEmailAndCompletedDateLike(String userEmail, String completedDate);

    @Query("SELECT h.muscleGroup, COUNT(h) FROM History h " +
            "WHERE h.userEmail = :userEmail " +
            "GROUP BY h.muscleGroup")
    List<Object[]> countByMuscleGroup(@Param("userEmail") String userEmail);

    // workout list for specific Date on Calendar
    List<History> findByUserEmailAndCompletedDate(String userEmail, String completedDate);

    // completed workout list per month (for checking Calendar ex.Apr, May)
    @Query("SELECT DISTINCT h.completedDate FROM History h WHERE h.userEmail = :userEmail AND h.completedDate BETWEEN :startDate AND :endDate")
    List<String> findByCompletedDatesByUserEmailAndMonth(@Param("userEmail") String userEmail, @Param("startDate") String startDate, @Param("endDate") String endDate);

}
