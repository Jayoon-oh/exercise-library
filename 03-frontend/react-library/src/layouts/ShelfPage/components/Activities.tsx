import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import ShelfCurrentActivities from '../../../models/ShelfCurrentActivities';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { Link } from 'react-router-dom';
import { ActivitiesModal } from './ActivitiesModal';
import { AddRoutineModal } from './AddRoutineModal';
import { WorkoutTimer } from './WorkoutTImer';
import { MemoModal } from './MemoModal';

export const Activies = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [httpError, setHttpError] = useState(null);

    const [shelfCurrentActivities, setShelfCurrentActivities] = useState<ShelfCurrentActivities[]>([]);
    const [isLoadingUserActivities, setIsLoadingUserActivies] = useState(true);
    const [activate, setActivate] = useState(false);

    // Checkbox
    const [checkedIds, setCheckedIds] = useState<number[]>([]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddMemo, setShowAddMemo] = useState(false);

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

    const toggleCheck = (workoutId: number) => {
        if (checkedIds.includes(workoutId)) {
            // if it's checked, remove workoutIds
            setCheckedIds(checkedIds.filter(id => id !== workoutId));
        } else {
            // if not, leave workoutIds
            setCheckedIds([...checkedIds, workoutId]);
        }
    };

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

    async function completeWorkouts(memo: string) {
        if (checkedIds.length === 0) {
            alert("완료할 운동을 선택해주세요.")
            return;
        }
        const url = `${process.env.REACT_APP_API}/workouts/secure/complete`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ workoutIds: checkedIds, memo: memo })
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        alert("오늘의 운동 완료! 기록이 저장 되었습니다.")
        setCheckedIds([]); // initialize checkbox
        setActivate(!activate);
    }

    // 이미지 경로 처리 함수
    const getWorkoutImage = (imgName?: string) => {
        if (!imgName) return require('./../../../Images/ExerciseImages/barbellrow.jpg');

        if (imgName.startsWith('data:')) {
            return imgName;
        }

        try {
            return require(`./../../../Images/ExerciseImages/${imgName}`);
        } catch (error) {
            return require('./../../../Images/ExerciseImages/barbellrow.jpg');
        }
    };

    return (
        <div className='container'>
            {shelfCurrentActivities.length > 0 ? (
                <>
                    <div className='d-flex align-items-center gap-3 mb-3 flex-wrap mt-2'>
                        <div className='d-flex gap-2'>
                            <button className='btn btn-outline-primary btn-sm' onClick={() => setShowAddModal(true)}>
                                + 운동 추가
                            </button>
                            {showAddModal && (
                                <AddRoutineModal
                                    onClose={() => setShowAddModal(false)}
                                    onAdd={() => {
                                        setShowAddModal(false);
                                        setActivate(!activate);
                                    }}
                                />
                            )}
                            {showAddMemo && (
                                <MemoModal
                                    onClose={() => setShowAddMemo(false)}
                                    onComplete={(memo) => {
                                        completeWorkouts(memo);
                                        setShowAddMemo(false);
                                    }}
                                />
                            )}
                        </div>
                        <button className='btn main-color text-white btn-sm' onClick={() => setShowAddMemo(true)}>
                            운동 완료 ({checkedIds.length} / {shelfCurrentActivities.length})
                        </button>
                    </div>

                    {shelfCurrentActivities.map(shelfCurrentActivity => {
                        const isChecked = checkedIds.includes(shelfCurrentActivity.workout.id);

                        return (
                            <div key={shelfCurrentActivity.workout.id}
                                style={{ opacity: isChecked ? 0.5 : 1, transition: '0.3s' }}>
                                <div className='row align-items-center'>
                                    <div className='col-1 text-center'>
                                        <input
                                            type='checkbox'
                                            style={{ width: '1.5rem', height: '1.5rem', cursor: 'pointer' }}
                                            checked={isChecked}
                                            onChange={() => toggleCheck(shelfCurrentActivity.workout.id)}
                                        />
                                    </div>

                                    <div className='col-4 text-center'>
                                        <img
                                            src={getWorkoutImage(shelfCurrentActivity.workout.img)}
                                            className='img-fluid rounded'
                                            style={{ maxHeight: '150px', objectFit: 'cover' }}
                                            alt='Workout'
                                        />
                                    </div>

                                    <div className='card col-7 container d-flex'>
                                        <div className='card-body'>
                                            <div className='mt-2'>
                                                <h5 className={isChecked ? 'text-decoration-line-through text-muted' : 'fw-bold'}>
                                                    {shelfCurrentActivity.workout.title}
                                                </h5>
                                                <p className='text-muted mb-2 small'>{shelfCurrentActivity.workout.source}</p>

                                                <div className='d-flex flex-wrap align-items-center gap-2 small'>
                                                    <div>
                                                        <span className='text-secondary'>목표 세트: </span>
                                                        <span className='fw-bold text-dark'>{shelfCurrentActivity.maxSets}</span>
                                                    </div>
                                                    <div>
                                                        <span className='text-secondary'>횟수: </span>
                                                        <span className='fw-bold text-dark'>{shelfCurrentActivity.maxReps}</span>
                                                    </div>
                                                    <WorkoutTimer workoutId={shelfCurrentActivity.workout.id} />
                                                </div>

                                                <div className='d-flex gap-2 mt-3'>
                                                    <button className='btn btn-outline-danger btn-sm'
                                                        onClick={() => { if (window.confirm("루틴에서 삭제하시겠습니까?")) cancelWorkout(shelfCurrentActivity.workout.id) }}>
                                                        루틴 삭제
                                                    </button>
                                                    <Link className='btn btn-primary btn-sm' to={`/active/${shelfCurrentActivity.workout.id}`}>
                                                        리뷰작성
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        );
                    })}
                </>
            ) : (
                <div className='mt-3 text-center'>
                    <h3>현재 활성화된 운동이 없습니다.</h3>
                    <Link className='btn btn-primary' to={`/search`}>새로운 운동 찾으러가기.</Link>
                </div>
            )}
        </div>
    );
};