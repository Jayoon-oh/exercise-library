import { useDeferredValue, useEffect, useState } from "react";
import WorkoutModel from "../../models/WorkoutModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { ActivePageReviewBox } from "./ActivePageReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { auth0Config } from "../../lib/auth0Config";
import { useAuth0 } from "@auth0/auth0-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import { useParams } from "react-router-dom";

export const ActiveWorkoutPage = () => {

    const [reviewRenderTrigger, setReviewRenderTrigger] = useState(0);

    const { workoutId } = useParams<{ workoutId: string }>();

    // Auth0 인증
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

    const [workout, setWorkout] = useState<WorkoutModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // 리뷰
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    // 활성화 된 운동 수
    const [currentActivitiesCount, setCurrentActivitiesCount] = useState(0);
    const [isLoadingCurrentActivitiesCount, setIsLoadingCurrentActivitiesCount] = useState(true);

    // 활성화 된 운동 확인
    const [isActivated, setIsActivated] = useState(false);

    // 활성화 된 상세 정보
    const [activeDetails, setActiveDetails] = useState<any>(null);

    const [isLoadingWorkoutActivated, setIsLoadingWorkoutActivated] = useState(false);

    useEffect(() => {
        const fetchWorkout = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}/workouts/${workoutId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const loadedworkouts: WorkoutModel = {
                id: responseJson.id,
                title: responseJson.title,
                source: responseJson.source,
                description: responseJson.description,
                recommendedSets: responseJson.recommendedSets,
                muscleGroup: responseJson.muscleGroup,
                img: responseJson.img,
            };

            setWorkout(loadedworkouts);
            setIsLoading(false);
        };
        fetchWorkout().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [isActivated, getAccessTokenSilently, workoutId]);

    useEffect(() => {
        const fetchWorkReviews = async () => {
            const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByWorkoutId?workoutId=${workoutId}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    workoutId: responseData[key].workoutId,
                    reviewDescription: responseData[key].reviewDescription
                });
                weightedStarReviews = weightedStarReviews + responseData[key].rating;
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            } else {
                setTotalStars(0);
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };

        fetchWorkReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [workoutId, reviewRenderTrigger]);

    useEffect(() => {
        const fetchUserReviewWorkout = async () => {
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently();
                const url = `${process.env.REACT_APP_API}/reviews/secure/user/workout?workoutId=${workoutId}`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const userReview = await fetch(url, requestOptions);
                if (!userReview.ok) {
                    throw new Error('Something went wrong!');
                }
                const userReviewResponseJson = await userReview.json();
                setIsReviewLeft(userReviewResponseJson);
            }
            setIsLoadingUserReview(false);
        }
        fetchUserReviewWorkout().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })
    }, [workoutId, isAuthenticated, getAccessTokenSilently]);

    useEffect(() => {
        const fetchUserCurrentActivitiesCount = async () => {
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently();
                const url = `${process.env.REACT_APP_API}/workouts/secure/currentActives/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-type': 'application/json'
                    }
                };
                const currentActivitiesCountResponse = await fetch(url, requestOptions);
                if (!currentActivitiesCountResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const currentActivitiesCountResponseJson = await currentActivitiesCountResponse.json();
                setCurrentActivitiesCount(currentActivitiesCountResponseJson);
            }
            setIsLoadingCurrentActivitiesCount(false);
        }
        fetchUserCurrentActivitiesCount().catch((error: any) => {
            setIsLoadingCurrentActivitiesCount(false);
            setHttpError(error.message);
        })

    }, [isAuthenticated, getAccessTokenSilently, isActivated]);

    useEffect(() => {
        const fetchUserActivatedWorkout = async () => {
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently();
                const url = `${process.env.REACT_APP_API}/workouts/secure/isActivated/byuser?workoutId=${workoutId}`

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-type': 'Application/json'
                    }
                };

                const response = await fetch(url, requestOptions);
                if (!response.ok) {
                    throw new Error("Something went wrong!");
                }

                const text = await response.text();
                if (text) {
                    const result = JSON.parse(text); // parsing only if contents's existed.
                    setIsActivated(true);
                    setActiveDetails(result);
                } else {
                    setIsActivated(false);
                    setActiveDetails(null);
                }
            }
        }
        fetchUserActivatedWorkout().catch((error: any) => {
            setHttpError(error.message);
        })
    }, [workoutId, isAuthenticated, getAccessTokenSilently]);

    async function activeWorkout(sets: number, reps: number) {
        const accessToken = await getAccessTokenSilently();
        const url = `${process.env.REACT_APP_API}/workouts/secure/active?workoutId=${workoutId}&maxSets=${sets}&maxReps=${reps}`;

        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const activeResposne = await fetch(url, requestOptions);
        if (!activeResposne.ok) {
            throw new Error('Something went wrong!');
        }

        alert("운동루틴에 추가 되었습니다.")

        setIsActivated(true);

        setActiveDetails({
            maxSets: sets,
            maxReps: reps
        })
    }

    async function submitReview(starInput: number, reviewDescription: string) {
        let workoutId: number = 0;
        if (workout?.id) {
            workoutId = workout.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, workoutId, reviewDescription);
        const url = `${process.env.REACT_APP_API}/reviews/secure`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };
        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsReviewLeft(true);
        setReviewRenderTrigger(prev => prev + 1); // refresh list
    }

    async function updateReview(starInput: number, reviewDescription: string) {
        const url = `${process.env.REACT_APP_API}/reviews/secure/update/review`;
        const accessToken = await getAccessTokenSilently();

        const reviewRequestModel = new ReviewRequestModel(starInput, workout?.id || 0, reviewDescription);

        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) throw new Error('수정 실패');

        setReviews(prev => prev.map(r =>
            r.userEmail === user?.email ? { ...r, rating: starInput, reviewDescription } : r
        ));
        setIsReviewLeft(true);

        setReviewRenderTrigger(prev => prev + 1);
        setDisplaySuccess(true);
        setTimeout(() => setDisplaySuccess(false), 3000);
    }

    async function deleteReview(reviewId: number) {
        const url = `${process.env.REACT_APP_API}/reviews/secure/delete/review?reviewId=${reviewId}`;
        const accessToken = await getAccessTokenSilently();

        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) throw new Error('삭제 실패');

        // update state
        setIsReviewLeft(false); // available writing review
        setReviewRenderTrigger(prev => prev + 1); // refresh review list
        setDisplaySuccess(true);
        setTimeout(() => setDisplaySuccess(false), 3000);
    }

    if (isLoading || isLoadingReview || isLoadingCurrentActivitiesCount || isLoadingWorkoutActivated || isLoadingUserReview) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    // 1. 이미지 처리 로직 업데이트
    let workoutImage: string;

    if (workout?.img) {
        if (workout.img.startsWith('data:')) {
            // DB에서 가져온 실제 Base64 데이터인 경우
            workoutImage = workout.img;
        } else {
            // 기존 폴더 내 파일명인 경우
            try {
                workoutImage = require(`./../../Images/ExerciseImages/${workout.img}`);
            } catch (error) {
                workoutImage = require('./../../Images/ExerciseImages/barbellrow.jpg');
            }
        }
    } else {
        // 이미지 데이터가 없는 경우 기본값
        workoutImage = require('./../../Images/ExerciseImages/barbellrow.jpg');
    }


    return (
        <div className="container mt-5 my-5">

            <div className='card shadow-sm p-4'>
                <div className='row'>
                    <div className='col-12 col-md-3 text-center'>
                        <img src={workoutImage} className='img-fluid rounded shadow' style={{ maxHeight: '349px', objectFit: 'cover', width: '100%' }} alt='Workout' />
                    </div>
                    <div className='col-12 col-md-4 container mt-3 mt-md-0'>
                        <div className='ml-2'>
                            <h2>{workout?.title}</h2>
                            <h5 className='text-primary'>{workout?.source}</h5>
                            <p className='lead'>{workout?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <ActivePageReviewBox workout={workout} currentActivitiesCount={currentActivitiesCount} isAuthenticated={isAuthenticated} isActivated={isActivated} isReviewLeft={isReviewLeft} activeWorkout={activeWorkout} submitReview={submitReview} activeDetails={activeDetails} />
                </div>
                <LatestReviews reviews={reviews} workoutId={workout?.id} userEmail={user?.email} updateReview={updateReview} deleteReview={deleteReview} />

                {displaySuccess && (
                    <div className="alert alert-success mt-3" role="alert">
                        요청이 성공적으로 처리되었습니다.
                    </div>
                )}

            </div>
        </div>
    );
}