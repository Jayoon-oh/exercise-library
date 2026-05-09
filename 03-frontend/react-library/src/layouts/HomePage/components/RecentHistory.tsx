import HistoryModel from "../../../models/HistoryModel";
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { GetWorkoutImage } from '../../Utils/GetWorkoutImage';
import { Link } from "react-router-dom";

export const RecentHistory = () => {

    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
    const [histories, setHistories] = useState<HistoryModel[]>([]);  // 기록 목록
    const [isLoading, setIsLoading] = useState(true);  // 로딩
    const [httpError, setHttpError] = useState(null);  // 에러

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (isAuthenticated) {

                const url = `${process.env.REACT_APP_API}/histories/secure/workoutHistories?&page=0&size=5`;
                const token = await getAccessTokenSilently();
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                };
                const historyResponse = await fetch(url, requestOptions);
                if (!historyResponse.ok) {
                    throw new Error("Something went wrong!");
                }
                const historyResponseJson = await historyResponse.json();

                setHistories(historyResponseJson.content);
            }
            setIsLoading(false);
        }
        fetchUserHistory().catch((error: any) => {
            setHttpError(error.message);
        })
    }, [isAuthenticated, user])

    if (isLoading) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>(httpError)</p>
            </div>
        )
    }

    return (
        <div className="container mt-4">
            <div className="card p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-3">
                        <h5 className="mb-0">📋 최근 운동 기록</h5>
                        {histories.length > 0 && (
                            <small className="text-muted">{histories[0]?.completedDate}</small>
                        )}
                    </div>
                    <Link to='/shelf' className="btn btn-sm btn-outline-secondary">
                        전체 보기 →
                    </Link>
                </div>

                {histories.length > 0 ? (
                    <div className="row g-3">
                        {histories.map(history => (
                            <div key={history.id} className="col-md-4">
                                <div className="card h-100 border-0 bg-light">
                                    <img src={GetWorkoutImage(history.img)}
                                        className="card-img-top"
                                        style={{ height: '150px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                                        alt={history.title} />
                                    <div className="card-body p-2">
                                        <h6 className="fw-bold mb-1">{history.title}</h6>
                                        <small className="text-muted">
                                            {history.actualSets}세트 x {history.actualReps}회
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-muted">아직 운동 기록이 없어요</p>
                        <Link className="btn btn-primary btn-sm" to='/search'>
                            운동 추가하기
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}