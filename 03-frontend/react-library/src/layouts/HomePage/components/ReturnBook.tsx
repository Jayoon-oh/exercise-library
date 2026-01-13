import React from 'react'

export const ReturnBook = () => {
    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='text-center'>
                <img src={require('./../../../Images/ExerciseImages/barbell-squat.jpg')}
                    width='151'
                    height='223'
                    alt="exercise"
                />
                <h6 className='mt-2'>스쿼트</h6>
                <p>Gym rat</p>
                <a className='btn main-color text-white' href='#'>운동 추가하기</a>
            </div>
        </div>
    )
}