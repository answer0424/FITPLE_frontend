import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import api from '../apis/api';
import * as auth from '../apis/auth';

export const LoginContext = createContext();
LoginContext.displayName = 'LoginContextName';

const LoginContextProvider = ({children}) => {

    const navigate = useNavigate();

    // 로그인 여부
    const [isLogin, setIsLogin] = useState(JSON.parse(localStorage.getItem('isLogin')) || false);

    // 유저 정보
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || {});

    // 권한 정보
    const [authority, setAuthority] = useState(JSON.parse(localStorage.getItem('authority')) || {isStudent: false, isTrainer: false, isAdmin: false})

    // 로그인 확인
    const loginCheck = async (isAuthPage = false) => {
        const accessToken = Cookies.get('accessToken');

        console.log(`accessToken: ${accessToken}`);
        let response;
        let data;

        // 1-1. JWT(accessToken) 이 없고 인증이 필요 없다면
        if (!accessToken) {
            console.log('쿠키에 accessToken이 없습니다.');
            logoutSetting();
            return;
        }

        // 1-2. 인증이 필요한 페이지라면 로그인 페이지로 이동
        if (!accessToken && isAuthPage) {
            navigate("/login");
        }

        // 2. accessToken이 있다면
        console.log('쿠키에 accessToken이 있습니다.');
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        try {
            response = await auth.userInfo();
        } catch (error) {
            console.log(`error: ${error}`);
            return;
        }

        // 응답 실패 시 
        if (!response) return;

        // user 정보 획득 성공
        console.log('JWT(accessToken)으로 사용자 인증 정보 요청 성공');

        data = response.data;
        console.log(`data: ${data}`);

        // 인증 실패
        if (data === 'UNAUTHORIZED' || response.status === 401) {
            console.error('accesstoken이 만료되었거나 인증에 실패하였습니다.');
            return;
        }

        // 인증 성공 로그인 정보 세팅
        const currentUsername = localStorage.getItem('username') || userInfo.username;
        loginSetting(data, accessToken, currentUsername);
    };

    // 로그인 요청
    const login = async (username, password, rememberId) => {
        console.log(`
            로그인 요청
            login(username:${username}, password:${password}, rememberId:${rememberId});
        `);

        // username 저장
        if (rememberId) Cookies.set('rememberId', username);
        else Cookies.remove('rememberId');

        try {
            const response = await auth.login(username, password);
            const { data, status, headers } = response;
            const { authorization } = headers; // 여기서 authorization 변수명을 제대로 입력

            const accessToken = authorization.replace('Bearer ', ''); // JWT 추출

            console.log(`
                -- login 요청응답 --
                  data : ${data}
                  status : ${status}
                  headers : ${headers}
                  jwt : ${accessToken}
            `);

            if (status === 200) {
                Cookies.set('accessToken', accessToken);

                // 로그인 세팅
                localStorage.setItem('username', username.toUpperCase());
                loginCheck(false);  // username도 함께 전달

                // 시작 페이지 이동
                navigate('/');
            }
        } catch (error) {
            console.log(`로그인 error: ${error}`);
            alert('로그인 실패 아이디 또는 비밀번호가 일치하지 않습니다.');
        }
    }

    // 로그아웃
    const logout = (force = false) => {
        // confirm 없이 강제 로그아웃
        console.log('로그아웃');

        // confirm 받아서 로그아웃
        if (confirm('로그아웃 하시겠습니까?')) {
            logoutSetting();
            navigate('/');
        } else{ 
            return;
        }

        if (force) {
            // 로그아웃 세팅
            logoutSetting();

            navigate('/');
            return;
        };

    }

    // 로그인 세팅
    const loginSetting = (userData, accessToken, username) => {
    console.log(userData);
    const normalizedUsername = username.trim().toUpperCase();
    const loggedInUser = userData.find(user => user.username.trim().toUpperCase() === normalizedUsername);

    console.log('로그인한 유저 : ', loggedInUser); // 로그인한 유저 정보를 출력

    if (loggedInUser) {
        const { id, username } = loggedInUser;
        // authorities 배열에서 authority 값을 추출
        const authorities = loggedInUser.authority;

        console.log(`
            loginSetting() 
               id : ${id}
               username : ${username}
               authority : ${authorities}
        `);

        // JWT 토큰을 header에 저장
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // 로그인 여부
        setIsLogin(true);

        // 유저 정보 세팅
        const updateUserInfo = { id, username, authorities };

        setUserInfo(updateUserInfo);

        // 권한 정보 세팅
        const updatedAuthority = { isStudent: false, isTrainer: false, isAdmin: false };
        if (authorities.includes('ROLE_STUDENT')) updatedAuthority.isStudent = true;
        else if (authorities.includes('ROLE_TRAINER')) updatedAuthority.isTrainer = true;
        else if (authorities.includes('ROLE_ADMIN')) updatedAuthority.isAdmin = true;

        setAuthority(updatedAuthority);

        navigate('/');

        // 새로고침 시 context로 리로딩되기 때문에 localStorage에 담긴 상태 정보가 초기화되도록 설정
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("userInfo", JSON.stringify(updateUserInfo));
        localStorage.setItem("authority", JSON.stringify(updatedAuthority));
    } else {
        console.error('로그인한 사용자 정보를 찾을 수 없습니다.');
    }
};


    // 로그아웃 세팅
    const logoutSetting = () => {
        // 상태 비우기
        setIsLogin(false);
        setUserInfo(null);
        setAuthority(null);

        // 쿠키 지우기
        Cookies.remove('accessToken');
        api.defaults.headers.common.Authorization = undefined;

        // 새로고침 시 localStorage 지우기
        localStorage.removeItem('isLogin');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('authority');
        localStorage.removeItem('username');
    }

    return (
        <LoginContext.Provider value={{ isLogin, userInfo, authority, loginCheck, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

export default LoginContextProvider;
