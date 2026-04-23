package com.workout.diary.service;

import com.workout.diary.entity.PointsHistory;
import com.workout.diary.entity.UserPoints;
import com.workout.diary.repository.PointsHistoryRepository;
import com.workout.diary.repository.UserPointsRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class PointsService {

    UserPointsRepository userPointsRepository;
    PointsHistoryRepository pointsHistoryRepository;

    @Autowired
    public PointsService(UserPointsRepository userPointsRepository, PointsHistoryRepository pointsHistoryRepository) {
        this.userPointsRepository = userPointsRepository;
        this.pointsHistoryRepository = pointsHistoryRepository;
    }

    // refer user points
    public UserPoints getUserPoints(String userEmail) {
        return userPointsRepository.findByUserEmail(userEmail);
    }

    // refer list of points history
    public List<PointsHistory> getPointsHistory(String userEmail) {
        return pointsHistoryRepository.findByUserEmail(userEmail);
    }

    public void addPoints(String userEmail, int points, String reason) {
        UserPoints userPoints = userPointsRepository.findByUserEmail(userEmail);

        if (userPoints == null) {
            userPoints = new UserPoints(userEmail, points);
        } else {
            userPoints.setTotalPoints(userPoints.getTotalPoints() + points);
        }
        userPointsRepository.save(userPoints);

        PointsHistory history = new PointsHistory(userEmail, points, reason);
        pointsHistoryRepository.save(history);
    }
}