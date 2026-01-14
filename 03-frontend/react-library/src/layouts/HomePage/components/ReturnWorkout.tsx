import React from 'react'
import WorkoutModel from '../../../models/WorkoutModel'

export const ReturnWorkout: React.FC<{ workout: WorkoutModel }> = (props) => {

    let workoutImage;
    try {
        // DB에 저장된 img 값이 있고, 해당 파일이 존재할 때
        if (props.workout.img) {
            workoutImage = require(`./../../../Images/ExerciseImages/${props.workout.img}`);
        } else {
            workoutImage = require('./../../../Images/ExerciseImages/barbellsquat.jpg');
        }
    } catch (error) {
        // 파일을 찾지 못했을 때의 기본값
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
                <a className='btn main-color text-white' href='#'>운동 추가하기</a>
            </div>
        </div>
    )
}