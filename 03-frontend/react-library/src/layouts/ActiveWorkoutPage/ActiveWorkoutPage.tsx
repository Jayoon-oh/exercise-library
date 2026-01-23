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

export const ActiveWorkoutPage = () => {

    // Auth0 인증
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const [workout, setWorkout] = useState<WorkoutModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Activites Count State
    const [currentActivitiesCount, setCurrentActivitiesCount] = useState(0);
    const [isLoadingCurrentActivitiesCount, setIsLoadingCurrentActivitiesCount] = useState(true);

    // Is workout Activated?
    const [isActivated, setIsActivated] = useState(false);
    const [isLoadingWorkoutActivated, setIsLoadingWorkoutActivated] = useState(false);

    const workoutId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchWorkout = async () => {
            const baseUrl: string = `http://localhost:8080/api/workouts/${workoutId}`;

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
                slots: responseJson.slots,
                slotsAvailable: responseJson.slotsAvailable,
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
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByWorkoutId?workoutId=${workoutId}`;

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
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };

        fetchWorkReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [isReviewLeft, workoutId]);

    useEffect(() => {
        const fetchUserReviewWorkout = async () => {
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently();
                const url = `http://localhost:8080/api/reviews/secure/user/workout?workoutId=${workoutId}`;

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
                const url = `http://localhost:8080/api/workouts/secure/currentActives/count`;
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
                const url = `http://localhost:8080/api/workouts/secure/isActivated/byuser?workoutId=${workoutId}`

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-type': 'Application/json'
                    }
                };
                const workoutActivataed = await fetch(url, requestOptions);
                if (!workoutActivataed.ok) {
                    throw new Error('Something went wrong');
                }
                const workoutActivatedResponseJson = await workoutActivataed.json();
                setIsReviewLeft(workoutActivatedResponseJson);
            }
            setIsLoadingUserReview(false);
        }
        fetchUserActivatedWorkout().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })
    }, [workoutId, isAuthenticated, getAccessTokenSilently]);

    async function activeWorkout() {
        const accessToken = await getAccessTokenSilently();
        const url = `http://localhost:8080/api/workouts/secure/active?workoutId=${workoutId}`;

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
        setIsActivated(true);
    }

    async function submitReview(starInput: number, reviewDescription: string) {
        let workoutId: number = 0;
        if (workout?.id) {
            workoutId = workout.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, workoutId, reviewDescription);
        const url = `http://localhost:8080/api/reviews/secure`;
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

    // 이미지경로
    let workoutImage;
    try {
        if (workout?.img) {
            workoutImage = require(`./../../Images/ExerciseImages/${workout.img}`);
        } else {
            workoutImage = require('./../../Images/ExerciseImages/barbellrow.jpg');
        }
    } catch (error) {
        workoutImage = require('./../../Images/ExerciseImages/barbellrow.jpg');
    }

    return (
        <div>
            {/* Desktop version */}
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        <img src={workoutImage} width='226' height='349' alt='Workout' />
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{workout?.title}</h2>
                            <h5 className='text-primary'>{workout?.source}</h5>
                            <p className='lead'>{workout?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <ActivePageReviewBox workout={workout} mobile={false} currentActivitiesCount={currentActivitiesCount} isAuthenticated={isAuthenticated} isActivated={isActivated} isReviewLeft={isReviewLeft} activeWorkout={activeWorkout} submitReview={submitReview} />
                </div>
                <hr />
                <LatestReviews reviews={reviews} workoutId={workout?.id} mobile={false} />
            </div>

            {/* mobile version*/}
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    <img src={workoutImage} width='226' height='349' alt='Workout' />
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{workout?.title}</h2>
                        <h5 className='text-primary'>{workout?.source}</h5>
                        <p className='lead'>{workout?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <ActivePageReviewBox workout={workout} mobile={false} currentActivitiesCount={currentActivitiesCount} isAuthenticated={isAuthenticated} isActivated={isActivated} isReviewLeft={isReviewLeft} activeWorkout={activeWorkout} submitReview={submitReview} />
                <hr />
                <LatestReviews reviews={reviews} workoutId={workout?.id} mobile={true} />
            </div>
        </div>
    );
}