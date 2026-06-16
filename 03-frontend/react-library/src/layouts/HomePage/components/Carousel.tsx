import { ReturnWorkout } from "./ReturnWorkout"
import { useEffect, useState } from "react"
import WorkoutModel from "../../../models/WorkoutModel"
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom"

export const Carousel = () => {

    const [workouts, setWorkouts] = useState<WorkoutModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchWorkouts = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}/workouts`;

            const url: string = `${baseUrl}?page=0&size=9`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.workouts;

            const loadedworkouts: WorkoutModel[] = [];

            for (const key in responseData) {
                loadedworkouts.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    source: responseData[key].source,
                    description: responseData[key].description,
                    recommendedSets: responseData[key].recommendedSets,
                    muscleGroup: responseData[key].muscleGroup,
                    img: responseData[key].img,
                });
            }

            setWorkouts(loadedworkouts);
            setIsLoading(false);
        };

        fetchWorkouts().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []);

    const chunkWorkouts = (array: WorkoutModel[], size: number) => {
        const chuncked = [];
        for (let i = 0; i < array.length; i += size) {
            chuncked.push(array.slice(i, i + size));
        }
        return chuncked;
    };

    const workoutChunks = chunkWorkouts(workouts, 3);

    if (isLoading) {
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

    return (
        <div className='container my-4 my-md-5' style={{ minHeight: 550, height: 'auto' }}>

            {/* title */}
            <div className='d-flex justify-content-between align-items-end border-bottom pb-3 mb-4'>
                <div className='homepage-carousel-title'>
                    <h3 className='fs-5 fs-md-3 fw-bold mb-0'>내일 아침 근육통이 기다려지는 루틴 💪</h3>
                </div>
                <Link className='btn btn-outline-secondary btn-sm d-none d-md-block' to='/search'>
                    더 보기 →
                </Link>
            </div>

            {/* Desktop */}
            <div id='carouselDesktop' className='carousel carousel-dark slide mt-4 d-none d-lg-block' data-bs-interval='false'>
                <div className='carousel-inner'>
                    {workoutChunks.map((chunk, index) => (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={`desktop-${index}`}>
                            <div className='row justify-content-center align-items-center'>
                                {chunk.map(workout => (
                                    <ReturnWorkout workout={workout} key={workout.id} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button className='carousel-control-prev' type='button' data-bs-target='#carouselDesktop' data-bs-slide='prev'>
                    <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>이전</span>
                </button>
                <button className='carousel-control-next' type='button' data-bs-target='#carouselDesktop' data-bs-slide='next'>
                    <span className='carousel-control-next-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>다음</span>
                </button>
            </div>

            {/* Mobile */}
            <div id='carouselMobile' className='carousel carousel-dark slide mt-4 d-lg-none' data-bs-interval='false'>
                <div className='carousel-inner'>
                    {workouts.map((workout, index) => (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={`mobile-${index}`}>
                            <div className='row justify-content-center align-items-center'>
                                <div className='col-11 col-sm-6 d-flex justify-content-center text-center'>
                                    <ReturnWorkout workout={workout} key={workout.id} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className='carousel-control-prev' type='button' data-bs-target='#carouselMobile' data-bs-slide='prev'>
                    <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>이전</span>
                </button>
                <button className='carousel-control-next' type='button' data-bs-target='#carouselMobile' data-bs-slide='next'>
                    <span className='carousel-control-next-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>다음</span>
                </button>
            </div>

            {/* more button for Mobile */}
            <div className='d-grid gap-2 mt-4 d-md-none'>
                <Link className='btn btn-outline-dark py-2' to='/search'>
                    다른 운동 더 보기
                </Link>
            </div>

        </div>
    )
}