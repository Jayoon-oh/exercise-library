import React from "react"
import WorkoutModel from "../../../models/WorkoutModel"
import { Link } from "react-router-dom";

export const SearchWorkout: React.FC<{ workout: WorkoutModel }> = (props) => {

    let workoutImage: string;

    if (props.workout.img) {
        if (props.workout.img.startsWith('data:')) {
            // DB에 저장된 값이 Base64 데이터인 경우 바로 사용
            workoutImage = props.workout.img;
        } else {
            // DB에 저장된 값이 파일명인 경우 
            try {
                workoutImage = require(`./../../../Images/ExerciseImages/${props.workout.img}`);
            } catch (e) {
                workoutImage = require('./../../../Images/ExerciseImages/barbellsquat.jpg');
            }
        }
    } else {
        // 이미지 데이터가 아예 없는 경우
        workoutImage = require('./../../../Images/ExerciseImages/barbellsquat.jpg');
    }

    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    {/* PC version */}
                    <div className='d-none d-lg-block'>
                        <img src={workoutImage}
                            width='123'
                            height='196'
                            alt='Workout' />
                    </div>
                    {/* Mobile version */}
                    <div className='d-lg-none d-flex justify-content-center
                    align-items-center'>
                        <img src={workoutImage}
                            width='123'
                            height='196'
                            alt='Workout' />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>
                            {props.workout.source}
                        </h5>
                        <h4>
                            {props.workout.title}
                        </h4>
                        <p className='card-text'>
                            {props.workout.description}
                        </p>
                    </div>
                </div>
                <div className='col-md-4 d-flex jusitfy-content-center align-items-center'>
                    <Link className='btn btn-md main-color text-white' to={`/Active/${props.workout.id}`}>
                        상세보기
                    </Link>
                </div>
            </div>
        </div>
    )
}