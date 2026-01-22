import { Link } from "react-router-dom"
import WorkoutModel from "../models/WorkoutModel"

export const ActivePageReviewBox: React.FC<{ workout: WorkoutModel | undefined, mobile: boolean, currentActivitiesCount: number, isAuthenticated: any, isActivated: boolean, activeWorkout: any, isReviewLeft: boolean }> = (props) => {
    function buttonRender() {
        if (props.isAuthenticated) {
            if (!props.isActivated && props.currentActivitiesCount < 5) {
                return (<button onClick={() => props.activeWorkout()} className="btn btn-success btn-lg">Activate</button>)
            } else if (props.isActivated) {
                return (<p><b>운동리스트에 추가되었습니다. 열운동하세요!</b></p>)
            } else if (!props.isActivated) {
                return (<p className='text-danger'>너무 많은 운동이 활성화 되어있어요!</p>)
            }
        }
        return (<Link to={'/login'} className="btn btn-success btn-lg">로그인</Link>)
    }
    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>
            <div className='card-body container'>
                <div className='mt-3'>
                    <p>
                        <b>{props.currentActivitiesCount}</b>
                    </p>
                    <hr />
                    {props.workout && props.workout.slotsAvailable && props.workout.slotsAvailable > 0 ?
                        <h4 className='text-success'>
                            리스트 추가 가능
                        </h4>
                        :
                        <h4 className='text-danger'>
                            업데이트 예정
                        </h4>
                    }
                    <div className='row'>
                        <p className='col-6 lead'>
                            권장 세트
                            <b> {props.workout?.slots}</b>
                        </p>
                        <p className='col-6 lead'>
                            난이도(LV)
                            <b> {props.workout?.slotsAvailable} </b>
                        </p>
                    </div>
                </div>
                {buttonRender()}
                <hr />
                <p className='mt-3'>
                    ※ 위 가이드는 일반적인 기준입니다.
                </p>
                <p>
                    로그인 후 나만의 운동 팁을 기록해보세요!
                </p>
            </div>
        </div>
    );
}
