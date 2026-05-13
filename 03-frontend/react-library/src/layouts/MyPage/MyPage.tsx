import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProfileCard } from "./components/ProfileCard";
import { BodyRecord } from "./components/BodyRecord";
import { PointsCard } from "./components/PointsCard";
import { WorkoutStats } from "./components/WorkoutStats";


export const MyPage = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [unreadCount, setUnreadCount] = useState(0);
    const [activeTab, setActiveTab] = useState('profile');

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
        <div className="container mt-5 mb-5">
            {/* profile header */}
            <div className="card shadow p-4 mb-4">
                <div className="d-flex align-items-center">
                    <img src={user?.picture} alt="Profile"
                        className="rounded-circle me-3" width="80" />
                    <div>
                        <h3>{user?.nickname || user?.name}님, 안녕하세요!</h3>
                        <p className="text-muted mb-0">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* alarm unread messages */}
            {unreadCount > 0 && (
                <div className="alert alert-warning shadow-sm d-flex justify-content-between align-items-center mb-4" role="alert">
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

            {/* Tab */}
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}>프로필</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}>운동통계</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'body' ? 'active' : ''}`}
                        onClick={() => setActiveTab('body')}>신체기록</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'points' ? 'active' : ''}`}
                        onClick={() => setActiveTab('points')}>포인트</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'qna' ? 'active' : ''}`}
                        onClick={() => setActiveTab('qna')}>
                        Q&A {unreadCount > 0 && <span className="badge bg-danger">{unreadCount}</span>}
                    </button>
                </li>
            </ul>

            {/* Contents of tab */}
            <div className="card shadow p-4">
                {activeTab === 'profile' && <ProfileCard />}
                {activeTab === 'stats' && <WorkoutStats />}
                {activeTab === 'body' && <BodyRecord />}
                {activeTab === 'points' && <PointsCard />}
                {activeTab === 'qna' && (
                    <div className="text-center py-4">
                        <p>작성한 질문과 답변을 확인하세요.</p>
                        <Link to='/messages' className="btn btn-primary">Q&A 이동하기</Link>
                    </div>
                )}
            </div>
        </div>
    )
}