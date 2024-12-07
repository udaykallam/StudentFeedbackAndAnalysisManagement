import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext.jsx';

const Logout = () => {
    const {LogoutUser} = useAuth();

    useEffect(()=>{
        LogoutUser();
    },[LogoutUser]);

    return <Navigate to="/" />;
};

export default Logout