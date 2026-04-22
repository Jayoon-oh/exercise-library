package com.workout.diary.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "body_record")
@Data
public class BodyRecord {

    public BodyRecord() {
    }

    public BodyRecord(String userEmail, Double weight, Double height, String recordedDate) {
        this.userEmail = userEmail;
        this.weight = weight;
        this.height = height;
        this.recordedDate = recordedDate;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "height")
    private Double height;

    @Column(name = "recorded_date")
    private String recordedDate;
}
