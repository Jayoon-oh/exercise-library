import { Link, NavLink } from "react-router-dom"

import { SpinnerLoading } from "../Utils/SpinnerLoading"
import { useAuth0 } from "@auth0/auth0-react"
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { UserSummaryModal } from "./components/UserSummaryModal";
import UserSummary from "../../models/UserSummary";
import { NotificationBell } from "./components/NotificationBell";
import { ProfileAvatar } from "./components/ProfileAvatar";

export const Navbar = () => {

    const [roles, setRoles] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(true);
    const { getAccessTokenSilently, user, isAuthenticated, loginWithRedirect, logout, getIdTokenClaims } = useAuth0();
    const [showModal, setShowModal] = useState(false);
    const [userSummary, setUserSummary] = useState<UserSummary | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchRoles = async () => {
            const claims = await getIdTokenClaims();
            const fetchedRoles = claims?.['https://exercise-library.com/roles'] || [];
            setRoles(fetchedRoles);
            setLoading(false);
        };

        fetchRoles();

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

        if (isAuthenticated) {
            fetchUnreadCount();
        }
    }, [user, isAuthenticated, getIdTokenClaims]);

    if (loading) {
        return <SpinnerLoading />
    }

    const handleLogout = () => {
        console.log("handleLogout");
        logout({ logoutParams: { returnTo: window.location.origin } })
    };

    const handleLogin = () => {
        loginWithRedirect();
        window.location.assign("/");
    };

    async function fetchUserSummary() {
        const token = await getAccessTokenSilently();
        const url = `${process.env.REACT_APP_API}/summary/secure/user-summary`;

        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(url, requestOptions)
        if (!response.ok) throw new Error('Something went wrong');

        const data = await response.json();
        setUserSummary(data);
        setShowModal(true);
    }

    console.log("isAuthenticated: ", isAuthenticated);

    return (
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
            <div className='container-fluid'>
                <Link className='navbar-brand' to='/home'>
                    Gym rat 🏋️‍♀️
                </Link>

                {/* Mobile UI */}
                {isAuthenticated && (
                    <div className='d-flex align-items-center ms-auto me-2 d-lg-none'>
                        <div className="me-3">
                            <NotificationBell unreadCount={unreadCount} onClick={fetchUserSummary} />
                        </div>
                        <ProfileAvatar url={user?.picture} onClick={fetchUserSummary} />
                    </div>
                )}

                <button className='navbar-toggler' type='button'
                    data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
                    aria-controls='#navbarNavDr' aria-expanded='false'
                    aria-label='toggle Navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>

                <div className='collapse navbar-collapse' id='navbarNavDropdown'>
                    {/* left side of Navbar */}
                    <ul className='navbar-nav'>

                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/search'>검색</NavLink>
                        </li>
                        {isAuthenticated && (
                            <>
                                <li className='nav-item'>
                                    <NavLink className='nav-link' to='/shelf'>운동루틴</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink className='nav-link' to='/messages'>Q&A</NavLink>
                                </li>
                            </>
                        )}
                    </ul>

                    <ul className='navbar-nav ms-auto align-itmes-center'>
                        {/* Right side of Navbar */}
                        {isAuthenticated ? (
                            <>
                                {roles?.includes('admin') && (
                                    <li className='nav-item'>
                                        <NavLink className='nav-link' to='/admin'>⚙️ 관리자 <span className="text-white-50 ms-2 me-2"></span></NavLink>
                                    </li>
                                )}
                                {/* Desktop UI message notification */}
                                <li className='nav-item ms-2 d-none d-lg-block'>
                                    <NotificationBell unreadCount={unreadCount} onClick={fetchUserSummary} />
                                </li>
                                {/* profile img */}
                                <li className='nav-item ms-2 d-none d-lg-block'>
                                    <ProfileAvatar url={user?.picture} onClick={fetchUserSummary} />
                                </li>

                                {showModal && (
                                    <UserSummaryModal
                                        userSummary={userSummary}
                                        onClose={() => setShowModal(false)}
                                        onLogout={handleLogout}
                                    />
                                )}
                            </>
                        ) : (
                            <li className='nav-item'>
                                <button className='btn btn-outline-light' onClick={handleLogin}>로그인</button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav >
    );
}