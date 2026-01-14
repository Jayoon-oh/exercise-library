package com.workout.diary.dao;

import com.workout.diary.entity.Workout;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

@SpringBootApplication
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    Page<Workout> findByTitleContaining(@RequestParam("title") String title, Pageable pegeable);
}
