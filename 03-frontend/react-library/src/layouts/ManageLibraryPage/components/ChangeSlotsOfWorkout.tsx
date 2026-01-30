import React, { useEffect, useState } from "react";
import WorkoutModel from "../../../models/WorkoutModel";
import { useAuth0 } from "@auth0/auth0-react";

export const ChangeSlotsOfWorkout: React.FC<{ workout: WorkoutModel, deleteWorkout: any }> = (props, key) => {

    const { getAccessTokenSilently } = useAuth0();
    const [slots, setSlots] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        const fetchWorkoutInState = () => {
            props.workout.slots ? setSlots(props.workout.slots) : setSlots(0);
            props.workout.slotsAvailable ? setRemaining(props.workout.slotsAvailable) : setRemaining(0);
        };
        fetchWorkoutInState();
    }, [])

    async function increaseSlots() {
        const url = `${process.env.REACT_APP_API}/admin/secure/increase/workout/slots?workoutId=${props.workout?.id}`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const slotsUpdateResponse = await fetch(url, requestOptions);
        if (!slotsUpdateResponse.ok) {
            throw new Error("Something went wront!");
        }
        setSlots(slots + 1);
        setRemaining(remaining + 1);
    }

    async function decreseSlots() {
        const url = `${process.env.REACT_APP_API}/admin/secure/decrease/workout/slots?workoutId=${props.workout?.id}`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const slotsUpdateResponse = await fetch(url, requestOptions);
        if (!slotsUpdateResponse.ok) {
            throw new Error("Something went wront!");
        }
        setSlots(slots - 1);
        setRemaining(remaining - 1);
    }

    async function deleteWorkout() {
        const url = `${process.env.REACT_APP_API}/admin/secure/delete/workout?workoutId=${props.workout?.id}`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const updateResponse = await fetch(url, requestOptions);
        if (!updateResponse.ok) {
            throw new Error("Something went wront!");
        }
        props.deleteWorkout();
    }


    let workoutImage: string;

    // 이미지처리
    if (props.workout?.img) {
        if (props.workout.img.startsWith('data:')) {
            // DB에서 가져온 실제 Base64 데이터인 경우
            workoutImage = props.workout.img;
        } else {
            // 기존 폴더 내 파일명인 경우
            try {
                workoutImage = require(`./../../../Images/ExerciseImages/${props.workout.img}`);
            } catch (error) {
                workoutImage = require('./../../../Images/ExerciseImages/barbellrow.jpg');
            }
        }
    } else {
        // 이미지 데이터가 없는 경우 기본값
        workoutImage = require('./../../../Images/ExerciseImages/barbellrow.jpg');
    }

    return (
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-2">
                    <div className="d-none d-lg-block">
                        {
                            <img src={workoutImage} width='123' height='196' alt='Workout' />
                        }
                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                        {
                            <img src={workoutImage} width='123' height='196' alt='Workout' />
                        }
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{props.workout.source}</h5>
                        <h4>{props.workout.title}</h4>
                        <p className="card-text">{props.workout.description}</p>
                    </div>
                </div>
                <div className="mt-3 col-md-4">
                    <div className="d-flex justify-content-center align-items-center">
                        <p>전체 Slots: <b>{slots}</b></p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <p>남아있는 Slots: <b>{remaining}</b></p>
                    </div>
                </div>
                <div className="mt-3 col-md-1">
                    <div className="d-flex justify-content-start">
                        <button className="m-1 btn btn-md btn-danger" onClick={deleteWorkout}>
                            삭제
                        </button>
                    </div>
                </div>
                <button className="m1 btn btn-md main-color text-white" onClick={increaseSlots}>수량 추가</button>
                <button className="m1 btn btn-md btn-warning" onClick={decreseSlots}>수량 줄이기</button>
            </div>
        </div>
    );
}