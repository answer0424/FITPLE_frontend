import React, { useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';

const OAuthCallback = () => {
    const { provider } = useParams();
    const location = useLocation();
    const { handleOAuthCallback } = useContext(LoginContext);
    
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        if (code && state) {
            handleOAuthCallback(provider, code, state);
        }
    }, []);
    
    return <div>소셜 로그인 처리중...</div>;
};

export default OAuthCallback;