import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import ShelfCurrentActivities from '../../../models/ShelfCurrentActivities';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { Link } from 'react-router-dom';
import { ActivitiesModal } from './ActivitiesModal';
import { isFunctionTypeNode } from 'typescript';

export const Activies = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [httpError, setHttpError] = useState(null);

    const [shelfCurrentActivities, setShelfCurrentActivities] = useState<ShelfCurrentActivities[]>([]);
    const [isLoadingUserActivities, setIsLoadingUserActivies] = useState(true);
    const [activate, setActivate] = useState(false);

    useEffect(() => {
        const fetchUserCurrentActivities = async () => {
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently();
                const url = `${process.env.REACT_APP_API}/workouts/secure/currentActives`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const shelfCurrentActivitiesResponse = await fetch(url, requestOptions);
                if (!shelfCurrentActivitiesResponse.ok) {
                    throw new Error("Something went wrong!");
                }
                const shelfCurrentActivitiesResponseJson = await shelfCurrentActivitiesResponse.json();
                setShelfCurrentActivities(shelfCurrentActivitiesResponseJson);
            }
            setIsLoadingUserActivies(false);
        }
        fetchUserCurrentActivities().catch((error: any) => {
            setIsLoadingUserActivies(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [isAuthenticated, getAccessTokenSilently, activate])

    if (isLoadingUserActivities) return <SpinnerLoading />;
    if (httpError) return <div className='container m-5'><p>{httpError}</p></div>;

    async function cancelWorkout(workoutId: number) {
        const url = `${process.env.REACT_APP_API}/workouts/secure/cancel?workoutId=${workoutId}`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-type': 'application/json'
            }
        };
        const cancelResponse = await fetch(url, requestOptions);
        if (!cancelResponse.ok) {
            throw new Error("Something went wrong");
        }
        setActivate(!activate);
    }

    async function extendDays(workoutId: number) {
        const url = `${process.env.REACT_APP_API}/workouts/secure/extend/days?workoutId=${workoutId}`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const renewResponse = await fetch(url, requestOptions);
        if (!renewResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setActivate(!activate);
    }

    // 이미지 경로 처리 함수
    const getWorkoutImage = (imgName?: string) => {
        try {
            if (imgName) {
                return require(`./../../../Images/ExerciseImages/${imgName}`);
            }
        } catch (error) {
            // 이미지 로드 실패 시 기본 이미지
        }
        return require('./../../../Images/ExerciseImages/barbellrow.jpg');
    };

    return (
        <div className='container'>
            {/* --- Desktop 화면 (Lg 이상) --- */}
            <div className='d-none d-lg-block mt-2'>
                {shelfCurrentActivities.length > 0 ? (
                    <>
                        <h5>운동 리스트:</h5>
                        {shelfCurrentActivities.map(shelfCurrentActivity => (
                            <div key={shelfCurrentActivity.workout.id}>
                                <div className='row mt-3 mb-3'>
                                    <div className='col-4 col-md-4 container'>
                                        <img src={getWorkoutImage(shelfCurrentActivity.workout.img)} width='226' height='349' alt='Workout' />
                                    </div>
                                    <div className='card col-3 col-md-3 container d-flex'>
                                        <div className='card-body'>
                                            <div className='mt-3'>
                                                <h5>⏳ 관리</h5>
                                                {shelfCurrentActivity.daysLeft > 0 && <p className='text-secondary'>남은 일수: {shelfCurrentActivity.daysLeft}일</p>}
                                                {shelfCurrentActivity.daysLeft === 0 && <p className='text-secondary'>오늘까지 마무리 해주세요!</p>}
                                                {shelfCurrentActivity.daysLeft < 0 && <p className='text-secondary'>새로운 운동을 추가하세요!</p>}

                                                <div className='list-group mt-3'>
                                                    <button className='list-group-item list-group-item-action' data-bs-toggle='modal' data-bs-target={`#modal${shelfCurrentActivity.workout.id}`}>
                                                        상세설정
                                                    </button>
                                                    <Link to={'search'} className='list-group-item list-group-item-action'>
                                                        다른 운동 찾기
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className='mt-3'>소중한 후기를 적어서 다른 회원들에게 도움을 주세요!</p>
                                            <Link className='btn btn-primary' to={`/checkout/${shelfCurrentActivity.workout.id}`}>
                                                리뷰작성
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <ActivitiesModal shelfCurrentActivity={shelfCurrentActivity} mobile={false} cancelWorkout={cancelWorkout} extendDays={extendDays} />
                            </div>
                        ))}
                    </>
                ) : (
                    <div className='mt-3'>
                        <h3>현재 활성화된 운동이 없습니다.</h3>
                        <Link className='btn btn-primary' to={`search`}>새로운 운동 찾으러가기.</Link>
                    </div>
                )}
            </div>

            {/* --- Mobile 화면 (Lg 미만) --- */}
            <div className='d-lg-none mt-2'>
                {shelfCurrentActivities.length > 0 ? (
                    <>
                        <h5>운동 리스트:</h5>
                        {shelfCurrentActivities.map(shelfCurrentActivity => (
                            <div key={shelfCurrentActivity.workout.id}>
                                <div className='row mt-3 mb-3'>
                                    <div className='col-4 col-md-4 container'>
                                        <img src={getWorkoutImage(shelfCurrentActivity.workout.img)} width='226' height='349' alt='Workout' />
                                    </div>
                                    <div className='card d-flex mt-5 mb-3'>
                                        <div className='card-body container'>
                                            <div className='mt-3'>
                                                <h4>⏳ 관리</h4>
                                                {shelfCurrentActivity.daysLeft > 0 && <p className='text-secondary'>남은 일수: {shelfCurrentActivity.daysLeft}일</p>}
                                                {shelfCurrentActivity.daysLeft === 0 && <p className='text-secondary'>오늘까지 마무리 해주세요!</p>}

                                                <div className='list-group mt-3'>
                                                    <button className='list-group-item list-group-item-action' data-bs-toggle='modal' data-bs-target={`#mobilemodal${shelfCurrentActivity.workout.id}`}>
                                                        상세설정
                                                    </button>
                                                    <Link to={'search'} className='list-group-item list-group-item-action'>
                                                        다른 운동 찾기
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className='mt-3'>소중한 후기를 적어서 다른 회원들에게 도움을 주세요!</p>
                                            <Link className='btn btn-primary' to={`/checkout/${shelfCurrentActivity.workout.id}`}>
                                                리뷰작성
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <ActivitiesModal shelfCurrentActivity={shelfCurrentActivity} mobile={true} cancelWorkout={cancelWorkout} extendDays={extendDays} />
                            </div>
                        ))}
                    </>
                ) : (
                    <div className='mt-3'>
                        <h3>현재 활성화된 운동이 없습니다.</h3>
                        <Link className='btn btn-primary' to={`search`}>새로운 운동 찾으러가기.</Link>
                    </div>
                )}
            </div>
        </div>
    );
};