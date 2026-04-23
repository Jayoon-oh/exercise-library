package com.workout.diary.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="user_points")
@Data
public class UserPoints {

        public UserPoints() {}

        public UserPoints(String userEmail, Integer totalPoints) {
                this.userEmail = userEmail;
                this.totalPoints = totalPoints;
        }

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        private Long id;

        @Column(name = "user_email")
        private String userEmail;

        @Column(name = "total_points")
        private Integer totalPoints;
}
