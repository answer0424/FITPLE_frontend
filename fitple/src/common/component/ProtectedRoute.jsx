import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginContext } from '../../mainpage/contexts/LoginContextProvider';

const ProtectedRoute = ({ children }) => {
    const { isLogin, loginCheck } = useContext(LoginContext);
    const [checkComplete, setCheckComplete] = useState(false);

    useEffect(() => {

        if (isLogin) {
            setCheckComplete(true);
            return;
        }

        const checkAuth = async () => {
            try {
                await loginCheck(true);
            } finally {
                setCheckComplete(true);
            }
        };

        checkAuth();
    }, [isLogin]); 

   
    if (!checkComplete) {
        return null;
    }

    
    if (!isLogin) {
        return <Navigate to="/login" replace />;
    }


    return children;
};

export default ProtectedRoute;