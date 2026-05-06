import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import ShelfCurrentActivities from '../../../models/ShelfCurrentActivities';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { Link } from 'react-router-dom';
import { ActivitiesModal } from './ActivitiesModal';
import { AddRoutineModal } from './AddRoutineModal';

export const Activies = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [httpError, setHttpError] = useState(null);

    const [shelfCurrentActivities, setShelfCurrentActivities] = useState<ShelfCurrentActivities[]>([]);
    const [isLoadingUserActivities, setIsLoadingUserActivies] = useState(true);
    const [activate, setActivate] = useState(false);

    // Checkbox
    const [checkedIds, setCheckedIds] = useState<number[]>([]);

    const [showAddModal, setShowAddModal] = useState(false);

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

    async function completeWorkouts() {
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
            body: JSON.stringify(checkedIds)
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
            {/* --- Desktop 화면 (Lg 이상) --- */}
            <div className='d-none d-lg-block mt-2'>
                {shelfCurrentActivities.length > 0 ? (
                    <>
                        <div className='d-flex justify-content-between align-items-center mb-4'>
                            <h5>오늘 운동 루틴</h5>
                            <div className='d-flex gap-2'>
                                <button className='btn btn-primary' onClick={() => setShowAddModal(true)}>
                                    + 운동 추가
                                </button>
                                {showAddModal && (
                                    <AddRoutineModal
                                        onClose={() => setShowAddModal(false)}
                                        onAdd={() => {
                                            setShowAddModal(false);
                                            setActivate(!activate);  // Refresh routine list
                                        }}
                                    />
                                )}
                            </div>
                            {/* 전체 완료 버튼 구현예정 */}
                            <button className='btn btn-success fw-bold' onClick={completeWorkouts}>
                                운동 완료 ({checkedIds.length} / {shelfCurrentActivities.length})
                            </button>
                        </div>

                        {shelfCurrentActivities.map(shelfCurrentActivity => {
                            // confirm is it checked or not
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
                                                onChange={() => toggleCheck(shelfCurrentActivity.workout.id)} />
                                        </div>

                                        <div className='col-3 text-center'>
                                            <img src={getWorkoutImage(shelfCurrentActivity.workout.img)} width='150' height='230' alt='Workout' />
                                        </div>

                                        <div className='card col-7 container d-flex'>
                                            <div className='card-body'>
                                                <div className='mt-3'>
                                                    <h4 className={isChecked ? 'text-decoration-line-through text-muted' : 'fw-bold'}>
                                                        {shelfCurrentActivity.workout.title}
                                                    </h4>
                                                    <p className='text-muted mb-3'>{shelfCurrentActivity.workout.source}</p>

                                                    {/*show daily target sets & reps*/}
                                                    <div className='d-flex align-items-center gap-4'>
                                                        <div>
                                                            <span className='text-secondary'>목표 세트: </span>
                                                            <span className='fw-bold text-dark'>{shelfCurrentActivity.maxSets}</span>
                                                        </div>
                                                        <div>
                                                            <span className='text-secondary'>횟수: </span>
                                                            <span className='fw-bold text-dark'>{shelfCurrentActivity.maxReps}</span>
                                                        </div>
                                                        <div>
                                                            {shelfCurrentActivity.daysLeft > 0 ? (
                                                                <span className='text-primary fw-bold'>남은 기한: {shelfCurrentActivity.daysLeft}일</span>
                                                            ) : (
                                                                <span className='text-danger fw-bold'>기간만료</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className='d-flex gap-2 mt-3'>
                                                        <button className='btn btn-outline-danger btn-sm'
                                                            onClick={() => { if (window.confirm("루틴에서 삭제하시겠습니까?")) cancelWorkout(shelfCurrentActivity.workout.id) }}
                                                        >
                                                            루틴 삭제
                                                        </button>
                                                        <Link className='btn btn-primary' to={`/active/${shelfCurrentActivity.workout.id}`}>
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
                    <div className='mt-3'>
                        <h3>현재 활성화된 운동이 없습니다.</h3>
                        <Link className='btn btn-primary' to={`search`}>새로운 운동 찾으러가기.</Link>
                    </div>
                )}
            </div>

            {/* --- Mobile 화면 --- */}
            <div className='d-lg-none mt-2'>
                {shelfCurrentActivities.length > 0 ? (
                    <>
                        <div className='d-flex justify-content-between align-items-center mb-4'>
                            <h5>오늘 운동 루틴</h5>
                            <div className='d-flex gap-2'>
                                <button className='btn btn-primary' onClick={() => setShowAddModal(true)}>
                                    + 운동 추가
                                </button>
                                {showAddModal && (
                                    <AddRoutineModal
                                        onClose={() => setShowAddModal(false)}
                                        onAdd={() => {
                                            setShowAddModal(false);
                                            setActivate(!activate);  // Refresh routine list
                                        }}
                                    />
                                )}
                            </div>
                            <button className='btn btn-success fw-bold' onClick={completeWorkouts}>
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

                                        <div className='col-3 text-center'>
                                            <img src={getWorkoutImage(shelfCurrentActivity.workout.img)} className='img-fluid rounded' alt='Workout' />
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
                                                        <div>
                                                            {shelfCurrentActivity.daysLeft > 0 ? (
                                                                <span className='text-primary fw-bold'>D-{shelfCurrentActivity.daysLeft}</span>
                                                            ) : (
                                                                <span className='text-danger fw-bold'>만료</span>
                                                            )}
                                                        </div>
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
                                    {/* <ActivitiesModal shelfCurrentActivity={shelfCurrentActivity} mobile={true} cancelWorkout={cancelWorkout} extendDays={extendDays} /> */}
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
        </div>
    );
};