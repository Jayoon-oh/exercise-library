package com.workout.diary.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "workout_history")
@Data
public class History {

    public History (){}

    public History(String userEmail, LocalDate startDate, LocalDate completedDate,
                   String title, String source, String description, String img, Integer actualReps, Integer actualSets, Integer targetReps, Integer targetSets, String muscleGroup, String workoutMemo) {
        this.userEmail = userEmail;
        this.startDate = startDate;
        this.completedDate = completedDate;
        this.title = title;
        this.source = source;
        this.description = description;
        this.img = img;
        this.actualReps = actualReps;
        this.actualSets = actualSets;
        this.targetReps = targetReps;
        this.targetSets = targetSets;
        this.muscleGroup = muscleGroup;
        this.workoutMemo = workoutMemo;
    }

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "completed_date")
    private LocalDate completedDate;

    @Column(name = "title")
    private String title;

    @Column(name = "source")
    private String source;

    @Column(name = "description")
    private String description;

    @Column(name = "img")
    private String img;

    @Column(name = "actual_reps")
    private Integer actualReps;

    @Column(name = "actual_sets")
    private Integer actualSets;

    @Column(name = "target_reps")
    private Integer targetReps;

    @Column(name = "target_sets")
    private Integer targetSets;

    @Column(name = "muscle_group")
    private String muscleGroup;

    @Column(name = "workout_memo")
    private String workoutMemo;
}
