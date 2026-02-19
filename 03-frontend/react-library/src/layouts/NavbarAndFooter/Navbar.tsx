import { NavLink } from "react-router-dom"

import { SpinnerLoading } from "../Utils/SpinnerLoading"
import { useAuth0 } from "@auth0/auth0-react"
import React, { useEffect, useLayoutEffect, useState } from 'react';

export const Navbar = () => {

    const [roles, setRoles] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, loginWithRedirect, logout, getIdTokenClaims } = useAuth0();

    useEffect(() => {
        const fetchRoles = async () => {
            const claims = await getIdTokenClaims();
            const fetchedRoles = claims?.['https://exercise-library.com/roles'] || [];
            setRoles(fetchedRoles);
            setLoading(false);
        };

        fetchRoles();
    }, [isAuthenticated, getIdTokenClaims]);

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

    console.log("isAuthenticated: ", isAuthenticated);

    return (
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
            <div className='container-fluid'>
                <span className='navbar-brand'>Gym rat 🏋️‍♀️</span>
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
                            <NavLink className='nav-link' to='/home'>홈</NavLink>
                        </li>
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
                                        <NavLink className='nav-link' to='/admin'>⚙️ 관리자 <span className="text-white-50 ms-2 me-2">|</span></NavLink>
                                    </li>
                                )}
                                <li className='nav-item'>
                                    <NavLink className='nav-link' to='/profile'>마이페이지</NavLink>
                                </li>
                                <li className='nav-item ms-2'>
                                    <button className='btn btn-outline-light' onClick={handleLogout}>로그아웃</button>
                                </li>
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