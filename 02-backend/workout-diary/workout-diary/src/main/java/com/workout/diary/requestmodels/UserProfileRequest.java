package com.workout.diary.requestmodels;

import lombok.Data;

@Data
public class UserProfileRequest {
    private Boolean gender;

    private String birthDate;
}
