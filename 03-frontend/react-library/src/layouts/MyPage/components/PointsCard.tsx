import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useLayoutEffect, useState } from "react";

export const PointsCard = () => {
    const { user, getAccessTokenSilently } = useAuth0();

    const [totalPoints, setTotalPoints] = useState<string | null>('');

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const token = await getAccessTokenSilently();
                const url = `${process.env.REACT_APP_API}/points/secure/search/points`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                if (!response.ok) throw new Error('Failed to fetch count');

                const points = await response.json();
                if (points) {
                    setTotalPoints(points.totalPoints);
                }
            } catch (error) {
                console.error("Erorr fetching unread count:", error);
            }
        };

        if (user) {
            fetchPoints();
        }
    }, [user, getAccessTokenSilently])

    return (
        <div className="col-md-4 mb-3">
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
    )
}