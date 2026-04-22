package com.workout.diary.repository;

import com.workout.diary.entity.BodyRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BodyRecordRepository extends JpaRepository<BodyRecord, Long> {
    List<BodyRecord> findByUserEmail(String userEmail);
}
