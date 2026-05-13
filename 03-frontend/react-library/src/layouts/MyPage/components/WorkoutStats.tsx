import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export const WorkoutStats = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [monthlyCount, setMonthlyCount] = useState<number[]>([]);
    const [muscleGroupCount, setMuscleGroupCount] = useState<{ [key: string]: number }>({});
    const [thisMonthCount, setThisMonthCount] = useState<number>(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = await getAccessTokenSilently();

                const thisMonthRes = await fetch(`${process.env.REACT_APP_API}/histories/secure/thisMonthCount`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
                setThisMonthCount(await thisMonthRes.json());

                const monthlyRes = await fetch(`${process.env.REACT_APP_API}/histories/secure/MonthlyCount`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
                setMonthlyCount(await monthlyRes.json());

                const muscleRes = await fetch(`${process.env.REACT_APP_API}/histories/secure/MuscleGroupCount`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
                setMuscleGroupCount(await muscleRes.json());

            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        if (user) fetchStats();
    }, [user, getAccessTokenSilently]);

    const monthlyChartData = monthlyCount.map((count, index) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - index));
        return { month: `${date.getMonth() + 1}월`, count };
    });

    const muscleGroupChartData = Object.entries(muscleGroupCount).map(([key, value]) => ({
        name: key, value
    }));

    return (
        <div className="row mt-4">
            {/* Completed workout of this month */}
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

            {/* Montly Data */}
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

            {/* Statistics of each part */}
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
                                        <Cell key={index} fill={['#198754', '#0d6efd', '#ffc107', '#dc3545', '#0dcaf0'][index % 5]} />
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
    )
}