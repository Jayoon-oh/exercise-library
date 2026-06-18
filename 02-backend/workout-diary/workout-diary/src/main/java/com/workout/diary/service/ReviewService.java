package com.workout.diary.service;

import com.workout.diary.constants.PointsConstants;
import com.workout.diary.repository.ReviewRepository;
import com.workout.diary.entity.Review;
import com.workout.diary.requestmodels.ReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@Transactional
public class ReviewService {

    private ReviewRepository reviewRepository;
    private PointsService pointsService;
    @Autowired
    public ReviewService(ReviewRepository reviewRepository, PointsService pointsService) {
        this.reviewRepository = reviewRepository;
        this.pointsService = pointsService;
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
        review.setDate(LocalDateTime.now());
        reviewRepository.save(review);
        pointsService.addPoints(userEmail, PointsConstants.REVIEW_WRITE_POINTS, PointsConstants.REVIEW_WRITE_MSG);
    }

    public void updateReview(String userEmail, ReviewRequest reviewRequest) throws Exception{
        Review review = reviewRepository.findByUserEmailAndWorkoutId(userEmail, reviewRequest.getWorkoutId());

        if(review == null) {
            throw new Exception("해당 리뷰를 수정할 권한이 없습니다.");
        }

        review.setRating(reviewRequest.getRating());
        review.setReviewDescription(reviewRequest.getReviewDescription().orElse(null));

    }

    public void deleteReview(String userEmail, Long reviewId) throws Exception {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new Exception("리뷰를 찾을 수 없습니다."));

        if (!review.getUserEmail().equals(userEmail)) {
            throw new Exception("삭제 권한이 없습니다.");
        }
        reviewRepository.delete(review);
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
