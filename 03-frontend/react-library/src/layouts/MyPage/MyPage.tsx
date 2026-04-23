import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProfileCard } from "./components/ProfileCard";
import { BodyRecord } from "./components/BodyRecord";
import { PointsCard } from "./components/PointsCard";


export const MyPage = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const token = await getAccessTokenSilently();
                const url = `${process.env.REACT_APP_API}/messages/secure/unread/count`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                if (!response.ok) throw new Error('Failed to fetch count');

                const count = await response.json();
                setUnreadCount(count);
            } catch (error) {
                console.error("Erorr fetching unread count:", error);
            }
        };

        if (user) {
            fetchUnreadCount();
        }
    }, [user, getAccessTokenSilently]);


    return (
        <div className="container mt-5">
            {/* unread messages */}
            {unreadCount > 0 && (
                <div className="alert alert-warning shadow-sm d-flex justify-content-between align-items-center mb=4" role="alert">
                    <div>
                        <span className="me-2">✉️</span>
                        확인하지 않은 <strong>{unreadCount}개</strong>의 답변이 있습니다!
                    </div>
                    <Link
                        to={{ pathname: '/messages', state: { tab: 'qna' } } as any}
                        className="btn btn-sm btn-warning"
                    >
                        보러가기
                    </Link>
                </div>
            )}

            <div className="card shadow p-4">
                {/* User name, email, pics */}
                <div className="d-flex align-items-center mb-4">
                    <img
                        src={user?.picture}
                        alt="Profile"
                        className="rounded-circle me-3"
                        width="80"
                    />
                    <div>
                        <h3>{user?.nickname || user?.name}님, 안녕하세요!</h3>
                        <p className="text-muted">{user?.email}</p>
                    </div>
                </div>
                <hr />

                {/*Q/A section*/}
                <div className="row mt-3">
                    <div className="col-md-6 mb-3">
                        <div className="card h-100 bg-light">
                            <div className="card-body text-center">
                                <h5 className="card-title">나의 Q/A 내역</h5>
                                <p className="card-text">작성한 질문과 답변을 확인하세요.</p>
                                <Link to='/messages' className="btn btn-primary">이동하기</Link>
                            </div>
                        </div>
                    </div>
                    <PointsCard />
                </div>

                {/*Components*/}
                <ProfileCard />
                <BodyRecord />
            </div >
        </div>
    )
}