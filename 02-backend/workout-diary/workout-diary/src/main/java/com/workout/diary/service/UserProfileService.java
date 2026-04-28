package com.workout.diary.service;

import com.workout.diary.entity.BodyRecord;
import com.workout.diary.entity.UserProfile;
import com.workout.diary.repository.BodyRecordRepository;
import com.workout.diary.repository.UserProfileRepository;
import com.workout.diary.requestmodels.BodyRecordRequest;
import com.workout.diary.requestmodels.UserProfileRequest;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
@Transactional
public class UserProfileService {

    private UserProfileRepository userProfileRepository;
    private BodyRecordRepository bodyRecordRepository;


    public UserProfileService(UserProfileRepository userProfileRepository, BodyRecordRepository bodyRecordRepository) {
        this.userProfileRepository = userProfileRepository;
        this.bodyRecordRepository = bodyRecordRepository;
    }

    public UserProfile getProfile(String userEmail) {
        return userProfileRepository.findByUserEmail(userEmail);
    }

    // save profile with inquiry existing profile
    public void saveProfile(String userEmail, UserProfileRequest userProfileRequest) {
        UserProfile userProfile = userProfileRepository.findByUserEmail(userEmail);

        if(userProfile == null) {
            userProfile = new UserProfile(userEmail, userProfileRequest.getGender(), userProfileRequest.getBirthDate());
        } else {
            userProfile.setGender(userProfileRequest.getGender());
            userProfile.setBirthDate(userProfileRequest.getBirthDate());
        }
            userProfileRepository.save(userProfile);
    }

    // add Body Record with BMI
    public void addBodyRecord(String userEmail, BodyRecordRequest bodyRecordRequest) {
        BodyRecord bodyRecord = new BodyRecord(userEmail,bodyRecordRequest.getWeight(), bodyRecordRequest.getHeight(),
                LocalDate.now().toString());

        // Calculate BMI
        double heightInMeters = bodyRecordRequest.getHeight()/100;
        double bmi = bodyRecordRequest.getWeight() / (heightInMeters * heightInMeters);
        bodyRecord.setBmi(Math.round(bmi * 10.0) / 10.0);

        // get userProfile for birthDate, gender
        UserProfile userProfile = userProfileRepository.findByUserEmail(userEmail);
        if (userProfile != null && userProfile.getBirthDate() !=null) {
            // Calculate BMR 0:female, 1:male
            double weightInKilograms = bodyRecord.getWeight();
            int age = Period.between(LocalDate.parse(userProfile.getBirthDate()), LocalDate.now()).getYears();

            double bmr;
            if ( userProfile.getGender() == false) {
                bmr = (10*weightInKilograms) + (6.25 * bodyRecord.getHeight()-(5*age) -161);
            } else {
                bmr = (10*weightInKilograms) + (6.25 * bodyRecord.getHeight()-(5*age) +5);
            }
            bodyRecord.setBmr(bmr);
        }

        bodyRecordRepository.save(bodyRecord);
    }

    // inquiry BodyRecord for graph image
    public List<BodyRecord> getBodyRecords(String userEmail){
        return bodyRecordRepository.findByUserEmailOrderByRecordedDateAsc(userEmail);
    }
}
