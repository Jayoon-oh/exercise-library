package com.workout.diary.service;

import com.workout.diary.dao.ReviewRepository;
import com.workout.diary.dao.WorkoutRepository;
import com.workout.diary.entity.Review;
import com.workout.diary.requestmodels.ReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;

@Service
@Transactional
public class ReviewService {

    private ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception {
        // 1. 중복 리뷰체크
        Review validateReview = reviewRepository.findByUserEmailAndWorkoutId(userEmail, reviewRequest.getWorkoutId());
        if (validateReview != null) {
            throw new Exception("Review already created");
        }

        // 2. 새 리뷰 객체 생성 및 데이터 채우기
        Review review = new Review();
        review.setWorkoutId(reviewRequest.getWorkoutId());
        review.setRating(reviewRequest.getRating());
        review.setUserEmail(userEmail);

        // 3. 리뷰 설명 처리
        if (reviewRequest.getReviewDescription().isPresent()) {
            review.setReviewDescription(reviewRequest.getReviewDescription().map(
                    // 값이 있으면 문자열 변환
                    Object::toString
                    ).orElse(null));
        }

        // 4. 날짜 설정 및 저장
        review.setDate(Date.valueOf(LocalDate.now()));
        reviewRepository.save(review);
    }

    public Boolean userReviewListed(String userEmail, Long workoutId) {
        Review valdiateReview = reviewRepository.findByUserEmailAndWorkoutId(userEmail, workoutId);
        if (valdiateReview != null) {
            return true;
        } else {
            return false;
        }
    }

}
