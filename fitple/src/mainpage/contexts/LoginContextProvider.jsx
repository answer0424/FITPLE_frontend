import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../apis/api';
import * as auth from '../apis/auth';

export const LoginContext = createContext();
LoginContext.displayName = 'LoginContextName';

const LoginContextProvider = ({children}) => {
    const navigate = useNavigate();

    // 초기 상태 설정
    const [isLogin, setIsLogin] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [authority, setAuthority] = useState({
        isStudent: false,
        isTrainer: false,
        isAdmin: false
    });

    // 컴포넌트 마운트 시 localStorage에서 상태 복원
    useEffect(() => {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUserInfo) {
            setIsLogin(true);
            setUserInfo(storedUserInfo);
            setAuthority(JSON.parse(localStorage.getItem('authority')) || {
                isStudent: false,
                isTrainer: false,
                isAdmin: false
            });
        }
    }, []);

    // 로그인 상태 확인
    const loginCheck = async (isAuthPage = false) => {
        if (isLogin && userInfo) {
            return true;
        }
        
        const accessToken = Cookies.get('accessToken');

        // 토큰이 없는 경우
        if (!accessToken) {
            logoutSetting();
            if (isAuthPage) {
                navigate("/login");
            }
            return;
        }

        // API 헤더 설정
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        try {
            const response = await auth.userInfo();
            
            if (!response || response.data === 'UNAUTHORIZED' || response.status === 401) {
                console.error('인증 실패 또는 토큰 만료');
                logoutSetting();
                return;
            }

            // 인증 성공시 로그인 정보 설정
            loginSetting(response.data, accessToken);

        } catch (error) {
            console.error('로그인 체크 중 에러:', error);
            logoutSetting();
        }
    };

    // 로그인 요청
    const login = async (username, password) => {
        try {
            const response = await auth.login(username, password);
            const { status, headers, data } = response;  // data도 받아옵니다
            
            if (status === 200) {
                const accessToken = headers.authorization.replace('Bearer ', '');
                Cookies.set('accessToken', accessToken);
                
                // loginCheck 대신 직접 loginSetting 호출
                loginSetting(data, accessToken);  // 서버에서 받은 사용자 데이터 사용
                return true;  // 로그인 성공 시 true 반환
            }
        } catch (error) {
            console.error('로그인 실패:', error);
            alert('로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.');
            return false;  // 로그인 실패 시 false 반환
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

        // API 헤더 설정
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // 권한 정보 생성
        const updatedAuthority = {
            isStudent: userAuthority?.includes('ROLE_STUDENT') || false,
            isTrainer: userAuthority?.includes('ROLE_TRAINER') || false,
            isAdmin: userAuthority?.includes('ROLE_ADMIN') || false,
        };

        // 상태 업데이트
        const updatedUserInfo = { id, username, authority: userAuthority };
        setIsLogin(true);
        setUserInfo(updatedUserInfo);
        setAuthority(updatedAuthority);

        // localStorage 업데이트
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        localStorage.setItem('authority', JSON.stringify(updatedAuthority));
    };

    // 로그아웃 상태 설정
    const logoutSetting = () => {
        // 상태 초기화
        setIsLogin(false);
        setUserInfo(null);
        setAuthority({
            isStudent: false,
            isTrainer: false,
            isAdmin: false
        });

        // 쿠키 & localStorage & API 헤더 클리어
        Cookies.remove('accessToken');
        api.defaults.headers.common.Authorization = undefined;
        localStorage.clear();
    };

    return (
        <LoginContext.Provider value={{ 
            isLogin, 
            userInfo, 
            authority, 
            loginCheck, 
            login, 
            logout 
        }}>
            {children}
        </LoginContext.Provider>
    );
};

export default LoginContextProvider;