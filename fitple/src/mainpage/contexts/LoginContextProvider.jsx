import React, { createContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import api from '../apis/api';
import * as auth from '../apis/auth';
import { Client } from '@stomp/stompjs';

export const LoginContext = createContext();
LoginContext.displayName = 'LoginContextName';

const LoginContextProvider = ({ children }) => {

    const navigate = useNavigate();

    // 로그인 여부
    const [isLogin, setIsLogin] = useState(JSON.parse(localStorage.getItem('isLogin')) || false);

    // 유저 정보
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || {});

    // 권한 정보
    const [authority, setAuthority] = useState(JSON.parse(localStorage.getItem('authority')) || {isStudent: false, isTrainer: false, isAdmin: false})


     // 웹소켓
     const stompClient = useRef(null);

     // 웹소켓 연결 함수
     const connectWebSocket = () => {
         if(stompClient.current) return; // 이미 연결되어 있을 경우를 방지
 
         const client = new Client({
             brokerURL: 'ws://localhost:8081/ws-chat',
             reconnectDelay: 5000,
             debug: (str) => console.log(str),
             onConnect: () => {
                 console.log('🔗 WebSocket Connected');
             },
             onDisconnect: () => {
                 console.log('❌ WebSocket Disconnected', error);
             }
         });
         client.activate();
         stompClient.current = client;
     }
 
     // 웹소켓 해제 함수
     const disconnectWebSocket = () => {
         if(stompClient.current) {
             stompClient.current.deactivate();
             stompClient.current = null;
             console.log('🛑 WebSocket Disconnected');
         }
     }
 
     useEffect(() => {
        if(isLogin) {
            connectWebSocket(); // 로그인 시 웹소켓 연결
        } else {
            disconnectWebSocket();  // 로그 아웃 시 웹소켓 해제
        }
    }, [isLogin]);

    // OAuth 로그인 처리
    const handleOAuthLogin = async (provider) => {
        try {
            const redirectUri = `${window.location.origin}/oauth/callback/${provider}`;
            const state = Math.random().toString(36).substring(7);
            localStorage.setItem('oauth_state', state);
            
            const loginUrl = `${import.meta.env.VITE_Server}/oauth2/authorization/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
            window.location.href = loginUrl;
        } catch (error) {
            console.error(`${provider} OAuth 로그인 중 에러:`, error);
        }
    };

    // OAuth 콜백 처리
    const handleOAuthCallback = async (provider, code, state) => {
        try {
            const savedState = localStorage.getItem('oauth_state');
            if (state !== savedState) {
                throw new Error('Invalid state parameter');
            }

            const response = await auth.oauthLogin(provider, code);
            const { status, headers, data } = response;

            if (status === 200) {
                const accessToken = headers.authorization.replace('Bearer ', '');
                Cookies.set('accessToken', accessToken);
                loginSetting(data, accessToken);
                navigate('/');
                return true;
            }
        } catch (error) {
            console.error(`${provider} OAuth 콜백 처리 중 에러:`, error);
            navigate('/login');
            return false;
        } finally {
            localStorage.removeItem('oauth_state');
        }
    };

    // 로그인 상태 확인
    const loginCheck = async (isAuthPage = false) => {
        const accessToken = Cookies.get('accessToken');

        console.log(`accessToken: ${accessToken}`);

        if (isLogin && userInfo) {
            return true;
        }

        if (!accessToken) {
            logoutSetting();
            if (isAuthPage) {
                navigate("/login");
            }
            return false;
        }

        if (isLogin && userInfo) {
            return true;
        }

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        try {
            const response = await auth.userInfo();
            
            if (!response || response.data === 'UNAUTHORIZED' || response.status === 401) {
                console.error('인증 실패 또는 토큰 만료');
                logoutSetting();
                return false;
            }

            loginSetting(response.data, accessToken);
            return true;

        } catch (error) {
            console.error('로그인 체크 중 에러:', error);
            logoutSetting();
            return false;
        }
    };

    // 로그인 요청
    const login = async (username, password) => {
        console.log(`
            로그인 요청
            login(username:${username}, password:${password});
        `);

        try {
            const response = await auth.login(username, password);
            const { status, headers, data } = response;
            const { authorization } = headers;

            const accessToken = authorization.replace('Bearer ', ''); // JWT 추출

            console.log(`
                -- login 요청응답 --
                  data : ${data}
                  status : ${status}
                  headers : ${headers}
                  jwt : ${accessToken}
            `);

            // 여기서 쿠키에 토큰을 저장해야 합니다
            Cookies.set('accessToken', accessToken);
        
            // 로그인 세팅을 할 때 userData도 함께 전달해야 합니다
            loginSetting(data, accessToken);

            
            // 로그인 세팅
            localStorage.setItem('username', username.toUpperCase());
            loginCheck(false);
            return true;

        } catch (error) {
            console.error('로그인 실패:', error);
            alert('로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.');
            return false;
        }
    };

    // 로그아웃
    const logout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            logoutSetting();
            navigate('/');
        }
    };

    // 로그인 정보 설정
    const loginSetting = (userData, accessToken) => {
        if (!userData) {
            console.error("사용자 데이터가 없습니다!");
            return;
        }

        const { id, username, authority: userAuthority } = userData;

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        disconnectWebSocket();
        connectWebSocket();

        const updatedAuthority = {
            isStudent: userAuthority?.includes('ROLE_STUDENT') || false,
            isTrainer: userAuthority?.includes('ROLE_TRAINER') || false,
            isAdmin: userAuthority?.includes('ROLE_ADMIN') || false,
        };

        const updatedUserInfo = { id, username, authority: userAuthority };
        setIsLogin(true);
        setUserInfo(updatedUserInfo);
        setAuthority(updatedAuthority);

        
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        localStorage.setItem('authority', JSON.stringify(updatedAuthority));
        localStorage.setItem('authority', JSON.stringify(updatedAuthority));
    };

    // 로그아웃 상태 설정
    const logoutSetting = () => {
        setIsLogin(false);
        setUserInfo(null);
        setAuthority({
            isStudent: false,
            isTrainer: false,
            isAdmin: false
        });

        Cookies.remove('accessToken');
        api.defaults.headers.common.Authorization = undefined;
        localStorage.clear();
    };

    return (
        <LoginContext.Provider 
            value={{ 
                isLogin, 
                userInfo, 
                userId: userInfo?.id,
                authority, 
                loginCheck, 
                login, 
                logout, 
                handleOAuthLogin,
                handleOAuthCallback,
                stompClient: stompClient.current 
            }}
        >
            {children}
        </LoginContext.Provider>
    );
};

export default LoginContextProvider;