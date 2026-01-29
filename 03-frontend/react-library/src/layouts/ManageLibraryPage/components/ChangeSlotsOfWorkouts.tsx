import { useEffect, useState } from "react";
import WorkoutModel from "../../../models/WorkoutModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { ChangeSlotsOfWorkout } from "./ChangeSlotsOfWorkout";

export const ChangeSlotsOfWorkouts = () => {


    const [workouts, setWorkouts] = useState<WorkoutModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [workoutsPerPage] = useState(5);
    const [totalAmountOfWorkouts, setTotalAmountOfWorkouts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [workoutDelete, setWorkoutDelete] = useState(false);

    useEffect(() => {
        const fetchWorkouts = async () => {
            const baseUrl: string = `http://localhost:8080/api/workouts?page=${currentPage - 1}&size=${workoutsPerPage}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const totalPagesFromApi = responseJson.page.totalPages;
            const totalElements = responseJson.page.totalElements;

            // 현재 페이지가 빈 페이지라면 (전체 페이지 수보다 크거나 같다면)
            if (currentPage > totalPagesFromApi && totalPagesFromApi > 0) {
                setCurrentPage(totalPagesFromApi) // 마지막 페이지로 변경
                return;
            }

            const responseData = responseJson._embedded.workouts;
            setTotalAmountOfWorkouts(totalElements);
            setTotalPages(totalPagesFromApi);

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
    }, [currentPage, workoutDelete]);

    const indexOfLastWorkout: number = currentPage * workoutsPerPage;
    const indexOfFirstWorkout: number = indexOfLastWorkout - workoutsPerPage;
    let lastItem = workoutsPerPage * currentPage <= totalAmountOfWorkouts ?
        workoutsPerPage * currentPage : totalAmountOfWorkouts;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const deleteWorkout = () => setWorkoutDelete(!workoutDelete);

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className="ocntainer m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    return (
        <div className="container m-5">
            {totalAmountOfWorkouts > 0 ?
                <>
                    <div className='mt-3'>
                        <h5>결과: ({totalAmountOfWorkouts})</h5>
                    </div>
                    <p>
                        전체 {totalAmountOfWorkouts}개 ({indexOfFirstWorkout + 1}-{lastItem})
                    </p>
                    {workouts.map(workout => (
                        <ChangeSlotsOfWorkout workout={workout} key={workout.id} deleteWorkout={deleteWorkout} />
                    ))}
                </>
                : <h3> 수량 변경 전에 운동을 추가해주세요.</h3>
            }
            {totalPages > 1 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}