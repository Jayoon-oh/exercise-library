import { ReturnWorkout } from "./ReturnWorkout"
import { useEffect, useState } from "react"
import WorkoutModel from "../../../models/WorkoutModel"
import { SpinnerLoading } from "../../Utils/SpinnerLoadiang";

export const Carousel = () => {

    const [workouts, setWorkouts] = useState<WorkoutModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchWorkouts = async () => {
            const baseUrl: string = 'http://localhost:8080/api/workouts';

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
                    slots: responseData[key].slots,
                    slotsAvailable: responseData[key].slotsAvailable,
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
        <div className='container mt-5' style={{ height: 550 }}>
            <div className='homepage-carousel-title'>
                <h3>내일 아침 근육통이 기다려지는 루틴을 찾아보세요 💪</h3>
            </div>
            <div id='carouselExampleControls' className='carousel carousel-dark slide mt-5
            d-none d-lg-block' data-bs-interval='false'>

                {/* Desktop */}
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {workouts.slice(0, 3).map(workout => (
                                <ReturnWorkout workout={workout} key={workout.id} />
                            ))}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {workouts.slice(3, 6).map(workout => (
                                <ReturnWorkout workout={workout} key={workout.id} />
                            ))}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {workouts.slice(6, 9).map(workout => (
                                <ReturnWorkout workout={workout} key={workout.id} />
                            ))}
                        </div>
                    </div>
                </div>

                <button className='carousel-control-prev' type='button'
                    data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                    <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>이전</span>
                </button>
                <button className='carousel-control-next' type='button'
                    data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                    <span className='carousel-control-next-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>다음</span>
                </button>
            </div>

            {/* Mobile */}
            <div className='d-lg-none mt-3'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <ReturnWorkout workout={workouts[7]} key={workouts[7].id} />
                </div>
            </div>
            <div className='homepage-carousel-title mt-3'>
                <a className='btn btn-outline-secondary btn-lg' href="#">더 보기</a>
            </div>
        </div>
    )
}