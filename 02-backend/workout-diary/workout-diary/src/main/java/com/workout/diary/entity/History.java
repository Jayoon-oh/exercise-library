package com.workout.diary.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "workout_history")
@Data
public class History {

    public History (){}

    public History(String userEmail, String startDate, String completedDate,
                   String title, String source, String description, String img) {
        this.userEmail = userEmail;
        this.startDate = startDate;
        this.completedDate = completedDate;
        this.title = title;
        this.source = source;
        this.description = description;
        this.img = img;
    }

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "completed_date")
    private String completedDate;

    @Column(name = "title")
    private String title;

    @Column(name = "source")
    private String source;

    @Column(name = "description")
    private String description;

    @Column(name = "img")
    private String img;


}
