package com.workout.diary.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "workout")
@Data
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "source")
    private String source;

    @Column(name = "description")
    private String description;

    @Column(name = "slots")
    private int slots;

    @Column(name = "slots_available")
    private int slotsAvailable;

    @Column(name = "muscle_group")
    private String muscleGroup;

    @Column(name = "img")
    private String img;

}
