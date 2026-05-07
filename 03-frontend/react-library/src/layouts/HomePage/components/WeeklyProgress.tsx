import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react"

export const WeeklyProgress = () => {
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const [completedDates, setCompletedDates] = useState<string[]>([]);

    useEffect(() => {
        const fetchCompletedDates = async () => {
            if (isAuthenticated) {
                const today = new Date();
                const start = new Date(today);
                start.setDate(today.getDate() - 7);

                const startDate = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
                const endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

                const accessToken = await getAccessTokenSilently();
                const url = `${process.env.REACT_APP_API}/histories/secure/WorkoutCalendar/Month?startDate=${startDate}&endDate=${endDate}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const datesResponse = await fetch(url, requestOptions);
                const datesResponseJson = await datesResponse.json();
                setCompletedDates(datesResponseJson);
            }
        }
        fetchCompletedDates();
    }, [user, isAuthenticated])

    // Calculate streak workout 
    const calculateStreak = (dates: string[]) => {
        let streak = 0;
        let checkDate = new Date();

        const todayStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;

        // check from yesterday if today's not completed yet 
        if (!dates.includes(todayStr)) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
            const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
            if (dates.includes(dateStr)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    }

    // make this week array
    const getWeekDays = () => {
        const today = new Date();
        const day = today.getDay(); // 0=sunday, 1=monday ...
        const monday = new Date(today);
        monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

        return ['월', '화', '수', '목', '금', '토', '일'].map((label, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const isToday = dateStr === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const isDone = completedDates.includes(dateStr);
            const isFuture = date > today;
            return { label, dateStr, isDone, isToday, isFuture };
        });
    }

    const weekDays = getWeekDays();
    const streak = calculateStreak(completedDates);

    return (
        <div className='card p-4 shadow-sm mt-4 h-100'>
            {/* consecutive workout */}
            <div className='mb-3'>
                <h5>🔥 {streak}일 연속 운동 중!</h5>
            </div>

            {/* status of the week */}
            <div className='d-flex justify-content-between text-center'>
                {weekDays.map((day) => (
                    <div key={day.label} style={{ flex: 1 }}>
                        <div className={`small mb-1 ${day.isToday ? 'fw-bold text-primary' : 'text-muted'}`}>
                            {day.label}
                        </div>
                        <div style={{ fontSize: '20px' }}>
                            {day.isFuture || day.isToday ? '⬜' : day.isDone ? '✅' : '❌'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}