import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import BodyRecordModel from "../../../models/BodyRecordModel";

export const BodyRecord = () => {
    const { user, getAccessTokenSilently } = useAuth0();

    const [monthlyCount, setMonthlyCount] = useState<number[]>([]);
    const [muscleGroupCount, setMuscleGroupCount] = useState<{ [key: string]: number }>({});
    const [thisMonthCount, setThisMonthCount] = useState<number>(0);
    const [weight, setWeight] = useState<number | string>('')
    const [height, setHeight] = useState<number | string>('')
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [bodyRecords, setBodyRecords] = useState<BodyRecordModel[]>([]);

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

                // 4. Graph for bodyRecords
                const bodyRecords = `${process.env.REACT_APP_API}/profiles/secure/bodyRecords`;
                const response4 = await fetch(bodyRecords, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                if (!response4.ok) throw new Error('Failed to fetch count');

                const bodyRecordsGraph = await response4.json();
                setBodyRecords(bodyRecordsGraph);

            } catch (error) {
                console.error("Erorr fetching unread count:", error);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user, getAccessTokenSilently]);

    async function addBodyRecord() {
        const token = await getAccessTokenSilently();
        const url = `${process.env.REACT_APP_API}/profiles/secure/bodyRecord`;

        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ weight: Number(weight), height: Number(height) })
        };

        const response = await fetch(url, requestOptions)
        if (!response.ok) throw new Error('Something went wrong');

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    }


    const monthlyChartData = monthlyCount.map((count, index) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - index));
        const label = `${date.getMonth() + 1}월`;
        return { month: label, count };
    });

    const muscleGroupChartData = Object.entries(muscleGroupCount).map(([key, value]) => ({
        name: key,
        value: value
    }));

    const bodyRecordsChartData = bodyRecords.map((record) => ({
        date: record.recordedDate,
        weight: record.weight,
        height: record.height
    }));

    return (
        <div className="row mt-4">

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

            <div className="row mt-4">
                <div className="col-12">
                    <div className="card bg-light p-3">
                        <h5 className="card-title">몸무게 기록</h5>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={bodyRecordsChartData}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="weight" stroke="#198754" name="몸무게" />
                                <Line type="monotone" dataKey="height" stroke="#0d6efd" name="키" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card bg-light p-3 mt-4">
                <h5 className="card-title">몸무게 / 키 기록</h5>
                <div className="row mt-3">
                    {/* weight*/}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">몸무게 (kg)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>

                    {/* height */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">키 (cm)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />
                    </div>
                </div>

                <button className="btn btn-success" onClick={addBodyRecord}>
                    기록하기
                </button>
                {saveSuccess && (
                    <div className="alert alert-success mt-2">기록됐습니다!</div>
                )}
            </div>
        </div >
    )
}