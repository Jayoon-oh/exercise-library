import React from 'react'
import WorkoutModel from '../../../models/WorkoutModel'
import { Link } from 'react-router-dom';

export const ReturnWorkout: React.FC<{ workout: WorkoutModel }> = (props) => {

    let workoutImage: any;

    if (props.workout.img) {
        // 1. 만약 Base64 데이터라면 (data:로 시작한다면) 그대로 사용
        if (props.workout.img.startsWith('data:image')) {
            workoutImage = props.workout.img;
        } else {
            // 2. 기존 로컬 파일 방식 (파일명만 있는 경우)
            try {
                workoutImage = require(`./../../../Images/ExerciseImages/${props.workout.img}`);
            } catch (e) {
                workoutImage = require('./../../../Images/ExerciseImages/barbellsquat.jpg');
            }
        }
    } else {
        // 3. 이미지가 없는 경우 기본 이미지
        workoutImage = require('./../../../Images/ExerciseImages/barbellsquat.jpg');
    }

    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='text-center'>
                {props.workout.img ?
                    <img
                        src={workoutImage}
                        width='151'
                        height='223'
                        alt="exercise"
                    />
                    :
                    <img
                        src={require('./../../../Images/ExerciseImages/barbellsquat.jpg')}
                        width='151'
                        height='223'
                        alt="exercise"
                    />
                }

                <h6 className='mt-2'>{props.workout.title}</h6>
                <p>{props.workout.source}</p>
                <Link className='btn main-color text-white' to={`active/${props.workout.id}`}>운동 추가하기</Link>
            </div>
        </div>
    )
}