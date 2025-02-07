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
    }, [isLogin]); // isLogin 상태가 변경될 때만 실행

    // 체크가 완료되지 않았다면 아무것도 렌더링하지 않음
    if (!checkComplete) {
        return null;
    }

    // 체크 완료 후 로그인되지 않은 경우
    if (!isLogin) {
        return <Navigate to="/login" replace />;
    }

    // 인증된 경우
    return children;
};

export default ProtectedRoute;