import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BodyRecordModel from "../../../models/BodyRecordModel";

export const BodyRecord = () => {
    const { user, getAccessTokenSilently } = useAuth0();

    const [weight, setWeight] = useState<number | string>('')
    const [height, setHeight] = useState<number | string>('')
    const [bodyRecords, setBodyRecords] = useState<BodyRecordModel[]>([]);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [displayWarning, setDisplayWarning] = useState(false);
    const [muscleMass, setMuscleMass] = useState<number | null>(null);
    const [bodyFatPercentage, setBodyFatPercentage] = useState<number | null>(null);

    useEffect(() => {
        const fetchBodyRecords = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(`${process.env.REACT_APP_API}/profiles/secure/bodyRecords`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch body records');
                const data = await response.json();
                setBodyRecords(data);
            } catch (error) {
                console.error("Error fetching body records:", error);
            }
        };

        if (user) fetchBodyRecords();
    }, [user, getAccessTokenSilently, saveSuccess]);

    async function addBodyRecord() {
        if (!weight || !height) {
            setDisplayWarning(true);
            return;
        }
        setDisplayWarning(false);

        const token = await getAccessTokenSilently();
        const response = await fetch(`${process.env.REACT_APP_API}/profiles/secure/bodyRecord`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                weight: Number(weight),
                height: Number(height),
                muscleMass,
                bodyFatPercentage
            })
        });

        if (!response.ok) throw new Error('Something went wrong');
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    }

    const getBmiStatus = (bmi: number | undefined) => {
        if (!bmi) return { label: '측정 없음', color: 'text-muted' };
        if (bmi < 18.5) return { label: '저체중', color: 'text-primary' };
        if (bmi < 25) return { label: '정상', color: 'text-success' };
        if (bmi < 30) return { label: '과체중', color: 'text-warning' };
        return { label: '비만', color: 'text-danger' };
    }

    const bodyRecordsChartData = bodyRecords.map((record) => ({
        date: record.recordedDate,
        weight: record.weight,
        height: record.height
    }));

    return (
        <div className="row mt-4">
            {/* Chart of body records */}
            <div className="col-12 mb-4">
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

            {/* input form */}
            <div className="col-12">
                <div className="card bg-light p-3">
                    <h5 className="card-title">몸무게 / 키 기록</h5>

                    {displayWarning && (
                        <div className="alert alert-danger">몸무게와 키를 입력해주세요.</div>
                    )}

                    <div className="row mt-3">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">몸무게 (kg)</label>
                            <input type="number" className="form-control"
                                value={weight} onChange={(e) => setWeight(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">키 (cm)</label>
                            <input type="number" className="form-control"
                                value={height} onChange={(e) => setHeight(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">골격근량 (kg)</label>
                            <input type="number" className="form-control"
                                value={muscleMass ?? ''}
                                onChange={(e) => setMuscleMass(e.target.value ? Number(e.target.value) : null)}
                                placeholder="선택 입력" />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">체지방률 (%)</label>
                            <input type="number" className="form-control"
                                value={bodyFatPercentage ?? ''}
                                onChange={(e) => setBodyFatPercentage(e.target.value ? Number(e.target.value) : null)}
                                placeholder="선택 입력" />
                        </div>
                    </div>

                    {bodyRecords.length > 0 && (
                        <p>BMI: <strong>{bodyRecords[bodyRecords.length - 1].bmi}</strong>{' '}
                            <span className={getBmiStatus(bodyRecords[bodyRecords.length - 1].bmi).color}>
                                ({getBmiStatus(bodyRecords[bodyRecords.length - 1].bmi).label})
                            </span>
                        </p>
                    )}

                    <button className="btn btn-success" onClick={addBodyRecord}>
                        기록하기
                    </button>

                    {saveSuccess && (
                        <div className="alert alert-success mt-2">기록됐습니다!</div>
                    )}
                </div>
            </div>
        </div>
    )
}