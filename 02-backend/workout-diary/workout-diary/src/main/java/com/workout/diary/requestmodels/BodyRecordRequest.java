package com.workout.diary.requestmodels;

import lombok.Data;

@Data
public class BodyRecordRequest {
    private Double weight;

    private Double height;

    private Double muscleMass;

    private Double bodyFatPercentage;
}
