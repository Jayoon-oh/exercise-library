import { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import UserSummary from "../../../models/UserSummary";
import { SpinnerLoading } from "../../Utils/SpinnerLoading"
import { Link } from 'react-router-dom';
import { GetWorkoutImage } from '../../Utils/GetWorkoutImage';


export const TodayRoutineSummary = () => {
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [routine, setRoutine] = useState<UserSummary | null>(null);

    useEffect(() => {
        const fetchRoutine = async () => {
            const token = await getAccessTokenSilently();
            const baseUrl: string = `${process.env.REACT_APP_API}/summary/secure/user-summary`;
            const response = await fetch(baseUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            setRoutine(responseJson);
            setIsLoading(false);

        }
        fetchRoutine();
    }, [user, isAuthenticated])

    if (isLoading) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return <div>{httpError}</div>
    }

    return (
        <div className='container mt-4'>
            <div className='card p-4 shadow-sm'>
                <h5>🏋️ 오늘의 루틴</h5>
                {routine?.todayWorkouts && routine.todayWorkouts.length > 0 ? (
                    <ul style={{ paddingLeft: '16px', margin: '4px 0' }}>
                        {routine.todayWorkouts.map((w, i) => (
                            <div key={i} className='d-flex align-items-center gap-3 mb-2'>
                                <img src={GetWorkoutImage(w.img)} width='100' height='100'
                                    style={{ objectFit: 'cover', borderRadius: '8px' }} alt={w.title} />
                                <div>
                                    <div className='fw-bold'>{w.title}</div>
                                    <small className='text-muted'>{w.actualSets}세트 x {w.actualReps}회</small>
                                </div>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>오늘 등록된 루틴이 없어요</p>
                )}
                <Link to='/shelf' className='btn main-color text-white mt-3'>
                    운동 시작하기 →
                </Link>
            </div>
        </div>
    )
}