package com.workout.diary.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_profile")
@Data
public class UserProfile {

    public UserProfile() {
   }

   public UserProfile(String userEmail, Boolean gender, String birthDate) {
        this.userEmail = userEmail;
        this.gender = gender;
        this.birthDate = birthDate;
   }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "gender")
    private Boolean gender;

    @Column(name = "birth_date")
    private String birthDate;
}
