
package com.workout.diary.repository;

import com.workout.diary.entity.PointsHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PointsHistoryRepository extends JpaRepository<PointsHistory, Long> {
    List<PointsHistory> findByUserEmail(String userEmail);

}
