import ShelfCurrentActivities from "../../../models/ShelfCurrentActivities"
import WorkoutModel from "../../../models/WorkoutModel"

export const ActivitiesModal: React.FC<{ shelfCurrentActivity: ShelfCurrentActivities, mobile: boolean, cancelWorkout: any, extendDays: any }> = (props) => {

    // 이미지 경로 처리 함수
    const getWorkoutImage = (imgName?: string) => {
        try {
            if (imgName) {
                return require(`./../../../Images/ExerciseImages/${imgName}`);
            }
        } catch (error) {
            // 이미지 로드 실패 시 기본 이미지
        }
        return require('./../../../Images/ExerciseImages/barbellrow.jpg');
    };

    return (
        <div className="modal fade" id={props.mobile ? `mobilemodal${props.shelfCurrentActivity.workout.id}` :
            `modal${props.shelfCurrentActivity.workout.id}`} data-bs-backdrop='static' data-bs-keyboard='false'
            aria-labelledby="staticBackdropLabel" aria-hidden='true' key={props.shelfCurrentActivity.workout.id} >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id='staticBackdropLabel'>Options</h5>
                        <button type='button' className="btn-close" data-bs-dismiss='modal' aria-label='Close'>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            <div className="mt-3">
                                <div className="row">
                                    <div className="col-2">
                                        {props.shelfCurrentActivity.workout?.img && (
                                            <img src={getWorkoutImage(props.shelfCurrentActivity.workout.img)}
                                                width='58' height='87' alt='Workout' />
                                        )}
                                    </div>
                                    <div className="col-10">
                                        <h6>{props.shelfCurrentActivity.workout.source}</h6>
                                        <h4>{props.shelfCurrentActivity.workout.title}</h4>
                                    </div>
                                </div>
                                <hr />
                                {props.shelfCurrentActivity.daysLeft > 0 && <p className='text-secondary'>남은 일수: {props.shelfCurrentActivity.daysLeft}일</p>}
                                {props.shelfCurrentActivity.daysLeft === 0 && <p className='text-secondary'>오늘까지 마무리 해주세요!</p>}
                                {props.shelfCurrentActivity.daysLeft < 0 && <p className='text-secondary'>새로운 운동을 추가하세요!</p>}
                                <div className="list-group mt-3">
                                    <button onClick={() => props.cancelWorkout(props.shelfCurrentActivity.workout.id)}
                                        data-bs-dismiss='modal' className="list-group-item list-group-item-action"
                                        aria-current='true'>
                                        목록에서 삭제
                                    </button>
                                    <button onClick={props.shelfCurrentActivity.daysLeft < 0 ?
                                        (event) => event.preventDefault()
                                        :
                                        () => props.extendDays(props.shelfCurrentActivity.workout.id)
                                    }
                                        data-bs-dismiss='modal'
                                        className={props.shelfCurrentActivity.daysLeft < 0 ?
                                            "list-group-item list-group-item-action inactiveLink" :
                                            "list-group-item list-group-item-action"
                                        }>
                                        {props.shelfCurrentActivity.daysLeft < 0 ?
                                            '기간이 만료된 운동은 달성목록에 추가할 수 없습니다.' : '7일 연장하기'
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss='modal'>
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}