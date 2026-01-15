import { useEffect, useState } from "react";
import WorkoutModel from "../../models/WorkoutModel";
import { SpinnerLoading } from "../Utils/SpinnerLoadiang";
import { StarsReview } from "../Utils/StarsReview";
import { ActivePageReviewBox } from "../ActivePageReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";

export const ActiveWorkoutPage = () => {

    const [workout, setWorkout] = useState<WorkoutModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

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
    }, []);

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
                    reviewDescription: responseData[key].description
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
    }, []);

    if (isLoading || isLoadingReview) {
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
                    <ActivePageReviewBox workout={workout} mobile={false} />
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
                <ActivePageReviewBox workout={workout} mobile={true} />
                <hr />
                <LatestReviews reviews={reviews} workoutId={workout?.id} mobile={true} />
            </div>
        </div>
    );
}