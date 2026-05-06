import { useEffect, useState } from "react";
import React from "react";

interface Props {
    workoutId: number;
    defaultTime?: number;
}

export const WorkoutTimer: React.FC<Props> = ({ workoutId, defaultTime = 90 }) => {
    const [timeLeft, setTimeLeft] = useState(defaultTime); // Remaining time
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsRunning(false);
                    return defaultTime; // Reset Timer
                }
                return prev - 1;
            })
        }, 1000); // execute timer every 1000ms(1sec)

        return () => clearInterval(interval);
    }, [isRunning]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="d-flex aling-items-center gap-2 mt-2">
            <button className={`btn btn-sm ${isRunning ? 'btn-danger' : 'btn-outline-primary'}`}
                onClick={() => setIsRunning(!isRunning)}
            >
                {isRunning ? '⏸ 일시정지' : '▶ 휴식 타이머'}
            </button>
            <span className="fw-bold">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
        </div>
    )
}