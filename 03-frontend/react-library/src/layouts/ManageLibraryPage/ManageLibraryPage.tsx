import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { Redirect } from "react-router-dom";
import { AdminMessages } from "./components/AdminMessages";
import { AddNewWorkout } from "./components/AddNewWorkout";
import { ChangeSlotsOfWorkouts } from "./components/ChangeSlotsOfWorkouts";

export const ManageLibraryPage = () => {
    const { getIdTokenClaims } = useAuth0();
    const [roles, setRoles] = useState<String[] | null>(null);
    const [loading, setLoading] = useState(true);

    const [changeQuantityOfWorkoutsClick, setChangeQuantityOfWorkoutsClick] = useState(false);
    const [messagesClick, setMessagesClick] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            const claims = await getIdTokenClaims();
            const fetchedRoles = claims?.['http://exercise-library.com/roles'] || [];
            setRoles(fetchedRoles);
            setLoading(false);
        };

        fetchRoles();
    }, [getIdTokenClaims]);

    function addWorkoutClickFunction() {
        setChangeQuantityOfWorkoutsClick(false);
        setMessagesClick(false);
    }

    function changeQuantityOfWorkoutsClickFunction() {
        setChangeQuantityOfWorkoutsClick(true);
        setMessagesClick(false);
    }

    function messagesClickFunction() {
        setChangeQuantityOfWorkoutsClick(false);
        setMessagesClick(true);
    }

    if (loading) {
        return <SpinnerLoading />
    }

    if (!roles?.includes('admin')) {
        return <Redirect to='/home' />
    }

    return (
        <div className="container">
            <div className="mt-5">
                <h3>관리하기</h3>
                <nav>
                    <div className="nav nav-tabs" id='nav-tab' role='tablist'>
                        <button onClick={addWorkoutClickFunction} className="nav-link active" id='nav-add-workout-tab' data-bs-toggle='tab'
                            data-bs-target='#nav-add-workout' type='button' role='tab' aria-controls='nav-add-workout'
                            aria-selected='false'>
                            새로운 운동 추가
                        </button>
                        <button onClick={changeQuantityOfWorkoutsClickFunction} className="nav-link" id='nav-quantity-tab' data-bs-toggle='tab'
                            data-bs-target='#nav-quantity' type='button' role='tab' aria-controls='nav-quantity'
                            aria-selected='true'>
                            수량 변경
                        </button>
                        <button onClick={messagesClickFunction} className="nav-link" id='nav-messages-tab' data-bs-toggle='tab'
                            data-bs-target='#nav-messages' type='button' role='tab' aria-controls='nav-messages'
                            aria-selected='true'>
                            내용
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id='nav-tabContent'>
                    <div className="tab-pane fade show active" id='nav-add-workout' role='tabpanel'
                        aria-labelledby="nav-add-workout-tab">
                        <AddNewWorkout />
                    </div>
                    <div className="tab-pane fade" id='nav-quantity' role='tabpanel' aria-labelledby="nav-quantity-tab">
                        {changeQuantityOfWorkoutsClick ? <ChangeSlotsOfWorkouts /> : <></>}
                    </div>
                    <div className="tab-pane fade" id='nav-messages' role='tabpanel' aria-labelledby="nav-messages-tab">
                        {messagesClick ? <AdminMessages /> : <></>}
                    </div>
                </div>
            </div>
        </div>
    )
}   