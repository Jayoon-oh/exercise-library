import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { SpinnerLoading } from '../layouts/Utils/SpinnerLoading';

const LoginPage = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    useEffect(() => {
        if (!isAuthenticated) {
            loginWithRedirect();
        }
    }, [loginWithRedirect, isAuthenticated]);

    return (
        <div className='container mt-5 d-flex justify-content-center'>
            <SpinnerLoading />
        </div>
    );
};

export default LoginPage;