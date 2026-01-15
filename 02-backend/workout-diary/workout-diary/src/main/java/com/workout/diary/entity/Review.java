package com.workout.diary.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "workout_review")
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "date")
    @CreationTimestamp
    private String date;

    @Column(name = "rating")
    private double rating;

    @Column(name = "workout_id")
    private Long workoutId;

    @Column(name = "review_description")
    private String reviewDescription;
}
