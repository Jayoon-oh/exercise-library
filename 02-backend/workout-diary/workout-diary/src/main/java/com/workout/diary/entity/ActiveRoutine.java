package com.workout.diary.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "active_routine")
@Data
public class ActiveRoutine {

    public ActiveRoutine() {}

    public ActiveRoutine(String userEmail, LocalDate startDate, LocalDate endDate, Long workoutId, Integer maxSets, Integer maxReps) {
        this.userEmail = userEmail;
        this.startDate = startDate;
        this.endDate = endDate;
        this.workoutId = workoutId;
        this.maxSets = maxSets;
        this.maxReps = maxReps;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "workout_id")
    private Long workoutId;

    @Column(name = "max_sets")
    private Integer maxSets;

    @Column(name = "max_reps")
    private Integer maxReps;


}
