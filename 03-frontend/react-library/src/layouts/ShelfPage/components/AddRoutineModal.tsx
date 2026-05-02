import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";
import WorkoutModel from "../../../models/WorkoutModel";
import React from 'react';

interface Props {
    onClose: () => void;
    onAdd: () => void;
}

export const AddRoutineModal: React.FC<Props> = ({ onClose, onAdd }) => {
    const { getAccessTokenSilently } = useAuth0();

    const [search, setSearch] = useState('');
    const [workoutList, setWorkoutList] = useState<WorkoutModel[]>([]);
    const [selectedWorkout, setSelectedWorkout] = useState<WorkoutModel | null>(null);  // 선택한 운동
    const [inputSets, setInputSets] = useState(0);
    const [inputReps, setInputReps] = useState(0);

    const fetchWorkouts = async () => {
        const url = `${process.env.REACT_APP_API}/workouts/search/findByTitleContaining?title=${search}&page=0&size=5`;
        const response = await fetch(url);
        const responseJson = await response.json();
        setWorkoutList(responseJson._embedded.workouts);
    }

    const addRoutine = async () => {
        if (!selectedWorkout || inputSets == 0 || inputReps === 0) return;

        const token = await getAccessTokenSilently();
        const url = `${process.env.REACT_APP_API}/workouts/secure/add?workoutId=${selectedWorkout.id}&sets=${inputSets}&reps=${inputReps}`;
        const reqeustOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await fetch(url, reqeustOptions);
        if (!response.ok) throw new Error('Something went wrong');
        onAdd();
    }

    return (
        <>
            {/* close Modal */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 999, background: 'rgba(0,0,0,0.5)' }}
                onClick={onClose}
            />
            <div style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                background: 'white', borderRadius: '12px', padding: '24px',
                minWidth: '400px', zIndex: 1000
            }}>
                <h5>운동 추가</h5>

                {/* search */}
                <div className="d-flex gap-2 mb-3">
                    <input
                        className="form-control"
                        placeholder="운동 검색"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={fetchWorkouts}>검색</button>
                </div>

                {/* result of searching */}
                {workoutList.map(workout => (
                    <div key={workout.id}
                        className={`p-2 mb-1 rounded ${selectedWorkout?.id === workout.id ? 'bg-primary text-white' : 'bg-light'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedWorkout(workout)}>
                        {workout.title}
                    </div>
                ))}

                {/* input Sets&Reps */}
                {selectedWorkout && (
                    <div className="mt-3">
                        <p>선택: <strong>{selectedWorkout.title}</strong></p>
                        <div className="d-flex gap-2">
                            <input type="number" className="form-control" placeholder="세트"
                                onChange={(e) => setInputSets(Number(e.target.value))} />
                            <input type="number" className="form-control" placeholder="횟수"
                                onChange={(e) => setInputReps(Number(e.target.value))} />
                        </div>
                    </div>
                )}

                <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-success" onClick={addRoutine}>추가</button>
                    <button className="btn btn-outline-secondary" onClick={onClose}>취소</button>
                </div>
            </div>
        </>
    )
}