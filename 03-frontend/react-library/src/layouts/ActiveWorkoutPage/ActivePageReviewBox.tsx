import { Link } from "react-router-dom"
import WorkoutModel from "../../models/WorkoutModel"
import { StarsReview } from "../Utils/StarsReview"
import { LeaveAReview } from "../Utils/LeaveAReview"
import { useEffect, useState } from "react"
import ShelfCurrentActivities from "../../models/ShelfCurrentActivities"


export const ActivePageReviewBox: React.FC<{ workout: WorkoutModel | undefined, currentActivitiesCount: number, isAuthenticated: any, isActivated: boolean, activeWorkout: any, isReviewLeft: boolean, submitReview: any, activeDetails: ShelfCurrentActivities | null }> = (props) => {

    const [sets, setSets] = useState(props.workout?.recommendedSets || 5);
    const [reps, setReps] = useState(12);

    useEffect(() => {
        if (props.isActivated && props.activeDetails) {
            setSets(props.activeDetails.maxSets ?? 5);
            setReps(props.activeDetails.maxReps ?? 12)
        } else if (!props.isActivated && props.workout) {
            setSets(props.workout.recommendedSets ?? 5);
        }
    }, [props.isActivated, props.activeDetails, props.workout]);

    function buttonRender() {
        if (props.isAuthenticated) {
            if (!props.isActivated && props.currentActivitiesCount < 5) {
                return (<button onClick={() => props.activeWorkout(sets, reps)} className="btn btn-success btn-lg">루틴에 추가하기</button>)
            } else if (props.isActivated) {
                return (<p className="text-center"><b>운동루틴에 추가 되었습니다.</b></p>)
            } else if (!props.isActivated) {
                return (<p className='text-danger text-center'>최대 {props.currentActivitiesCount}개 운동까지만 집중 관리할 수 있어요!</p>)
            }
        }
        return (<Link to={'/login'} className="btn btn-success btn-lg">로그인</Link>)
    }

    function reviewRender() {
        if (props.isAuthenticated && !props.isReviewLeft) {
            return (
                <div>
                    <LeaveAReview submitReview={props.submitReview} />
                </div>
            )
        } else if (props.isAuthenticated && props.isReviewLeft) {
            return (
                <div>
                    <b>이미 리뷰를 남기셨습니다.</b>
                </div>
            )
        }
        return (
            <div>
                <hr />
                <p>리뷰를 남기시려면 로그인 해주세요</p>
            </div>
        )
    }

    return (
        <div className='card col-12 col-md-3 container d-flex mb-5 mt-3 mt-md-0'>
            <div className='card-body container'>
                <div className='mt-3'>
                    <p>
                        나의 집중 루틴
                        <b> {props.currentActivitiesCount}/5 </b>
                    </p>
                    <hr />

                    <div className='row mb-4'>
                        <div className='col-6'>
                            <label className="form-label small text-muted">목표 세트 {props.workout?.recommendedSets && !props.isActivated &&
                                <span className="badge bg-info text-dark">권장: {props.workout.recommendedSets}</span>}
                            </label>
                            <input type="number" className="form-control text-center fw-bold" value={sets} disabled={props.isActivated} onChange={(e) => setSets(Number(e.target.value))} />
                        </div>
                        <div className='col-6'>
                            <label className="form-label small text-muted">목표 횟수</label>
                            <input type="number" className="form-control text-center fw-bold" value={reps} disabled={props.isActivated} onChange={(e) => setReps(parseInt(e.target.value))} />
                        </div>
                    </div>
                </div>

                {buttonRender()}

                <hr />
                <p className='mt-3'>
                    ※ 위 가이드는 일반적인 기준입니다.
                </p>
                {reviewRender()}
            </div>
        </div>
    );
}
