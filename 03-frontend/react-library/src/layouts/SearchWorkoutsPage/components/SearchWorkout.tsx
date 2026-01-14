import React from "react"
import WorkoutModel from "../../../models/WorkoutModel"

export const SearchWorkout: React.FC<{ workout: WorkoutModel }> = (props) => {

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
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.workout.img ?
                            <img src={workoutImage}
                                width='123'
                                height='196'
                                alt='Workout' />
                            :
                            <img
                                src={require('./../../../Images/ExerciseImages/barbellsquat.jpg')}
                                width='123'
                                height='196'
                                alt="exercise"
                            />
                        }
                    </div>
                    {/* Mobile version */}
                    <div className='d-lg-none d-flex justify-content-center
                    align-items-center'>
                        {props.workout.img ?
                            <img src={workoutImage}
                                width='123'
                                height='196'
                                alt='Workout' />
                            :
                            <img
                                src={require('./../../../Images/ExerciseImages/barbellsquat.jpg')}
                                width='123'
                                height='196'
                                alt="exercise"
                            />
                        }
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
                    <a className='btn btn-md main-color text-white' href='#'>
                        상세보기
                    </a>
                </div>
            </div>
        </div>
    )
}