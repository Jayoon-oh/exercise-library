import React, { useEffect, useState } from "react";
import WorkoutModel from "../../../models/WorkoutModel";
import { useAuth0 } from "@auth0/auth0-react";
import UpdateWorkoutRequest from "../../../models/UpdateWorkoutRequest";
import { UpdateWorkoutModal } from "./UpdateWorkoutModal";

export const ManageWorkout: React.FC<{ workout: WorkoutModel, deleteWorkout: any }> = (props) => {

    const { getAccessTokenSilently } = useAuth0();
    const [slots, setSlots] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        setSlots(props.workout.slots ? props.workout.slots : 0);
        setRemaining(props.workout.slotsAvailable ? props.workout.slotsAvailable : 0);
    }, [props.workout]);

    async function deleteWorkout() {
        const isConfirmed = window.confirm("정말 삭제하시겠습니까? 해당 운동은 영구삭제 됩니다.")
        if (!isConfirmed) return;

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

    async function submitUpdate(title: string, source: string, description: string, muscleGroup: string, img: any) {
        if (!window.confirm("수정하시겠습니까?")) return;

        const url = `${process.env.REACT_APP_API}/admin/secure/update/workout`;
        const accessToken = await getAccessTokenSilently();

        const updateRequest = new UpdateWorkoutRequest(
            props.workout.id, title, source, description, Number(slots), muscleGroup
        );

        // maintain existing DB path if image didn't changed
        updateRequest.img = (img && typeof img === 'string' && img.startsWith('data:')) ? img : props.workout.img;

        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateRequest)
        };

        try {
            const response = await fetch(url, requestOptions);

            if (response.ok) {
                alert("수정되었습니다.");
                props.deleteWorkout();
            } else {
                const errorMsg = await response.text();
                console.error("서버 에러 상세:", errorMsg);
                alert(`수정 실패: ${errorMsg}`);
            }
        } catch (error) {
            alert("네트워크 연결에 실패했습니다.");
        }
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
        // basic image value
        workoutImage = require('./../../../Images/ExerciseImages/barbellrow.jpg');
    }

    return (
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-2">
                    <div className="d-none d-lg-block">
                        <img src={workoutImage} width='123' height='196' alt='Workout' />
                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                        <img src={workoutImage} width='123' height='196' alt='Workout' />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{props.workout.source}</h5>
                        <h4>{props.workout.title}</h4>
                        <p className="card-text">{props.workout.description}</p>
                    </div>
                </div>

                {/* delete and modify button */}
                <div className="mt-3 col-md-1">
                    <div className="d-flex justify-content-start">
                        <button className="m-1 btn btn-md btn-danger" onClick={deleteWorkout}>
                            삭제
                        </button>
                        <button className="m-1 btn btn-md btn-primary" data-bs-toggle="modal"
                            data-bs-target={`#modal${props.workout.id}`}>
                            수정
                        </button>
                    </div>
                </div>
            </div>

            <UpdateWorkoutModal workout={props.workout} submitUpdate={submitUpdate} />
        </div>
    );
}