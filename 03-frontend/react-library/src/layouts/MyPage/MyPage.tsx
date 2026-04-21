import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export const MyPage = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [unreadCount, setUnreadCount] = useState(0);
    const [thisMonthCount, setThisMonthCount] = useState<number>(0);
    const [monthlyCount, setMonthlyCount] = useState<number[]>([]);
    const [muscleGroupCount, setMuscleGroupCount] = useState<{ [key: string]: number }>({});

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


    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = await getAccessTokenSilently();

                //1. count this month
                const thisMonthRes = `${process.env.REACT_APP_API}/histories/secure/thisMonthCount`;
                const response = await fetch(thisMonthRes, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                if (!response.ok) throw new Error('Failed to fetch count');

                const count = await response.json();
                setThisMonthCount(count);

                // 2. count montly
                const monthlyCountRes = `${process.env.REACT_APP_API}/histories/secure/MonthlyCount`;
                 const response2 = await fetch(monthlyCountRes, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                if (!response2.ok) throw new Error('Failed to fetch count');

                const countMonthly = await response2.json();
                setMonthlyCount(countMonthly);

                // 3. count Muscle Group
                const countMuscleGroupRes = `${process.env.REACT_APP_API}/histories/secure/MuscleGroupCount`;
                 const response3 = await fetch(countMuscleGroupRes, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                if (!response3.ok) throw new Error('Failed to fetch count');
                                
                const countMuscleGroup = await response3.json();
                setMuscleGroupCount(countMuscleGroup);

            } catch (error) {
                console.error("Erorr fetching unread count:", error);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user, getAccessTokenSilently]);


    const monthlyChartData = monthlyCount.map((count, index) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - index));
        const label = `${date.getMonth() + 1}월`;
        return { month: label, count};
    });

    const muscleGroupChartData = Object.entries(muscleGroupCount).map(([key, value]) => ({
    name: key,
    value: value
}));

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
                <div className="d-flex align-items-center mb-4">
                    {/* user profile */}
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

                <div className="row mt-4">
                    <div className="col-md-4 mb-3">
                        <div className="card h-100 bg-light">
                            <div className="card-body text-center">
                                <h5 className="card-title">나의 Q/A 내역</h5>
                                <p className="card-text">작성한 질문과 답변을 확인하세요.</p>
                                <Link to='/messages' className="btn btn-primary">이동하기</Link>
                            </div>
                        </div>
                    </div>
                
                {/* successed workout this month */} 
                <div className="col-md-4 mb-3">
                    <div className="card h-100 bg-light">
                        <div className="card-body text-center">
                            <h5 className="card-title">이번 달 완료한 운동</h5>
                            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#198754' }}>
                                {thisMonthCount}
                            </p>
                            <p className="text-muted">회</p>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card bg-light p-3">
                            <h5 className="card-title">월별 운동 완료 추이</h5>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={monthlyChartData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#198754" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card bg-light p-3">
                            <h5 className="card-title">부위별 운동 통계</h5>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={muscleGroupChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        innerRadius={40}
                                        label
                                    >
                                        {muscleGroupChartData.map((entry, index) => (
                                            <Cell key={index} fill={['#198754','#0d6efd','#ffc107','#dc3545','#0dcaf0'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>




            </div>
        </div >

    )
}