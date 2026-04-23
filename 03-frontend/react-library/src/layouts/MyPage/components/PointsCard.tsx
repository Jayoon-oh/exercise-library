import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useLayoutEffect, useState } from "react";
import PointsHistoryModel from "../../../models/PointsHistoryModel";

export const PointsCard = () => {
    const { user, getAccessTokenSilently } = useAuth0();

    const [totalPoints, setTotalPoints] = useState<string | null>('');
    const [pointsHistory, setPointsHistory] = useState<PointsHistoryModel[]>([]);

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                // userPoints
                const token = await getAccessTokenSilently();
                const response = await fetch(`${process.env.REACT_APP_API}/points/secure/search/points`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                if (!response.ok) throw new Error('Failed to fetch count');

                const points = await response.json();
                if (points) setTotalPoints(points.totalPoints);

                // details of points
                const response2 = await fetch(`${process.env.REACT_APP_API}/points/secure/search/userPoints`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })

                if (!response2.ok) throw new Error('Something went wrong');

                const userPoints = await response2.json();
                if (userPoints) setPointsHistory(userPoints);

            } catch (error) {
                console.error("Erorr fetching unread count:", error);
            }

        };
        if (user) fetchPoints();
    }, [user, getAccessTokenSilently])

    return (
        <div className="row mt-3">
            {/* userPoints */}
            <div className="col-md-4">
                <div className="card h-100 bg-light">
                    <div className="card-body text-center">
                        <h5 className="card-title">나의 포인트</h5>
                        <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffc107' }}>
                            {totalPoints ?? 0}
                        </p>
                        <p className="text-muted">점</p>
                    </div>
                </div>
            </div>

            {/*Details of points */}
            <div className="col-md-8">
                <div className="card bg-light p-3 mt-3">
                    <h5 className="card-title">포인트 내역</h5>
                    <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                        {pointsHistory.length === 0 ? (
                            <p className="text-muted">내역이 없습니다.</p>
                        ) : (
                            pointsHistory.map((history, index) => (
                                <div key={index} className="d-flex justify-content-between border-bottom py-2">
                                    <span>{history.reason}</span>
                                    <span className="text-success fw-bold">+{history.points}점</span>
                                    <span className="text-muted">{history.createdDate}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </div >
    )
}