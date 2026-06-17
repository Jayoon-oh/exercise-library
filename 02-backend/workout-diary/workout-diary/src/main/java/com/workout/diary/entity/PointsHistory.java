package com.workout.diary.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Table(name="points_history")
@Data
public class PointsHistory {
    public PointsHistory() {}

    public PointsHistory(String userEmail, Integer points, String reason) {
        this.userEmail = userEmail;
        this.points = points;
        this.reason = reason;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "points")
    private Integer points;

    @Column(name = "reason")
    private String reason;

    @Column(name = "created_date")
    @CreationTimestamp
    private LocalDate createdDate;
}
