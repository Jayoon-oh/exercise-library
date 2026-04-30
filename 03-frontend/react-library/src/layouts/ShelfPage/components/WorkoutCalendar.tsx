import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import HistoryModel from "../../../models/HistoryModel";

export const WorkoutCalendar = () => {
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

    // Calendar
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [completedDates, setCompletedDates] = useState<String[]>([]);
    const [dailyWorkouts, setDailyWorkouts] = useState<HistoryModel[]>([]);

    useEffect(() => {
        const fetchCompletedDates = async () => {
            if (isAuthenticated) {
                const now = new Date();
                const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // make 2 digit ex.04

                const accessToken = await getAccessTokenSilently();
                const url = `${process.env.REACT_APP_API}/histories/secure/WorkoutCalendar/Month?yearMonth=${yearMonth}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const datesResponse = await fetch(url, requestOptions);
                if (!datesResponse.ok) {
                    throw new Error('Something went wrong');
                }
                const datesResponseJson = await datesResponse.json();
                setCompletedDates(datesResponseJson);
            }
        }
        fetchCompletedDates();
    }, [user, isAuthenticated])

    const handleDateClick = async (date: Date) => {
        if (date === undefined) {
            return;
        }
        const completedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        setSelectedDate(completedDate);

        const accessToken = await getAccessTokenSilently()
        const url = `${process.env.REACT_APP_API}/histories/secure/WorkoutCalendar?completedDate=${completedDate}`;
        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const completedDatesResponse = await fetch(url, requestOptions);
        if (!completedDatesResponse.ok) {
            throw new Error('Something went wrong');
        }
        const completedDatesResponseJson = await completedDatesResponse.json();
        setDailyWorkouts(completedDatesResponseJson);
    }


    return (
        <div className="row">
            <div className="col-md-5">
                <h5>운동 달력</h5>
                <Calendar
                    onClickDay={handleDateClick}
                    tileContent={({ date }) => {
                        // date format '2000-01-01'
                        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

                        // mark ✅ if workout is done
                        if (completedDates.includes(dateStr)) {
                            return <div style={{ fontSize: '10px' }}>✅</div>;
                        }
                        return null;
                    }}
                />
            </div>

            <div className="col-md-7">
                {/* workout list on selected day */}
                {dailyWorkouts.length > 0 && (
                    <div>
                        <h5>{selectedDate} 운동 기록</h5>
                        {dailyWorkouts.map((workout, index) => (
                            <div key={index} className="card mt-2 p-3">
                                <h6>{workout.title}</h6>
                                <p>{workout.actualSets}세트 x {workout.actualReps}회</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
