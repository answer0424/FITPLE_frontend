import React, { createContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import api from "../apis/api";
import * as auth from "../apis/auth";
import { Client } from "@stomp/stompjs";
import { getUserChats } from "../apis/chat";

export const LoginContext = createContext();
LoginContext.displayName = "LoginContextName";

const LoginContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // 로그인 여부
  const [isLogin, setIsLogin] = useState(
    JSON.parse(localStorage.getItem("isLogin")) || false
  );

  // 유저 정보
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || {}
  );

  // 권한 정보
  const [authority, setAuthority] = useState(
    JSON.parse(localStorage.getItem("authority")) || {
      isStudent: false,
      isTrainer: false,
      isAdmin: false,
    }
  );

  // 웹소켓
  const stompClient = useRef(null);

  // 알림
  const [unreadMessage, setUnreadMessage] = useState(
    JSON.parse(localStorage.getItem("unreadMessage")) || {}
  );

  // 웹소켓 연결 함수
  const connectWebSocket = () => {
    if (stompClient.current) return; 

    const client = new Client({
      brokerURL: `ws://${import.meta.env.VITE_WebSoket_Server}/ws-chat`,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("🔗 WebSocket Connected");
        subscribeToChatRooms(userInfo.id);
      },
      onDisconnect: () => {
        console.log("❌ WebSocket Disconnected", error);
      },
    });
    client.activate();
    stompClient.current = client;
  };

  // 서버에서 사용자가 속한 채팅방 목록 가져오기
  const subscribeToChatRooms = async () => {
    if (!stompClient || !userInfo?.id) return;

    try {
      const response = await getUserChats(userInfo.id);

      const chatRooms = response;



      chatRooms.forEach((room) => {
        stompClient.current.subscribe(
          `/topic/chat/${room.chatId}`,
          (message) => {


            if (JSON.parse(message.body).userId === userInfo.id) {
              console.log(
                "내가 보낸 메세지는 알림 안뜸",
                message.senderId,
                userInfo.id
              );
              return;
            }


            handleNewMessage(room.chatId, JSON.parse(message.body));
          }
        );
      });
    } catch (error) {
      console.error("❌ 채팅방 목록을 불러오는 중 오류 발생:", error);
    }
  };

  // 새로운 메시지 왔을 경우 알림
  const handleNewMessage = (roomId, message) => {
    setUnreadMessage((prev) => {
      const updatedUnreadMessage = {
        ...prev,
        [roomId]: (prev[roomId] ?? 0) + 1,
      };
      // unreadMessage를 localStorage에 저장
      localStorage.setItem(
        "unreadMessage",
        JSON.stringify(updatedUnreadMessage)
      );
      return updatedUnreadMessage;
    });
  };

  // 웹소켓 해제 함수
  const disconnectWebSocket = () => {
    if (stompClient.current) {
      stompClient.current.deactivate();
      stompClient.current = null;

    }
  };

  useEffect(() => {
    if (isLogin) {
      connectWebSocket(); 
    } else {
      disconnectWebSocket(); 
    }
  }, [isLogin]);

  // 로그인 확인
  const loginCheck = async (isAuthPage = false) => {
    const accessToken = Cookies.get("accessToken");


    let response;
    let data;

 
    if (!accessToken) {
      console.log("쿠키에 accessToken이 없습니다.");
      logoutSetting();
      return;
    }


    if (!accessToken && isAuthPage) {
      navigate("/login");
    }


    console.log("쿠키에 accessToken이 있습니다.");
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    try {
      response = await auth.userInfo();

    } catch (error) {
      console.log(`error: ${error}`);
      return;
    }


    if (!response) return;


    console.log("JWT(accessToken)으로 사용자 인증 정보 요청 성공");

    data = response.data;


    // 인증 실패
    if (data === "UNAUTHORIZED" || response.status === 401) {
      console.error("accesstoken이 만료되었거나 인증에 실패하였습니다.");
      return;
    }

    // 인증 성공 로그인 정보 세팅
    const currentUsername =
      localStorage.getItem("username") || userInfo.username;

    loginSetting(data, accessToken, currentUsername);
  };

  useEffect(() => {
    loginCheck();
  }, []);

  // 로그인 요청
  const login = async (username, password) => {


    try {
      const response = await auth.login(username, password);
      const { data, status, headers } = response;
      const { authorization } = headers; 

      const accessToken = authorization.replace("Bearer ", ""); 



      if (status === 200) {
        Cookies.set("accessToken", accessToken);

 
        localStorage.setItem("username", username.toUpperCase());
        loginCheck(false);

 
        navigate("/");
      }
    } catch (error) {
      console.log(`로그인 error: ${error}`);
      alert("로그인 실패 아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  // 로그아웃
  const logout = (force = false) => {
    console.log("로그아웃");

    // ✅ 강제 로그아웃 (confirm 없이 실행)
    if (force) {
      logoutSetting();
      navigate("/");
      return;
    }

    // ✅ 일반 로그아웃 (confirm 창 띄움)
    const isConfirmed = window.confirm("로그아웃 하시겠습니까?");
    if (isConfirmed) {
      logoutSetting();
      navigate("/");
    }
  };

  const loginSetting = async (
    userData,
    accessToken,
    username,
    provider,
    providerId
  ) => {


    if (!userData) {
      console.error("🚨 userData가 비어있음!");
      return;
    }


    if (
      !username &&
      userData.provider === provider &&
      userData.providerId === providerId
    ) {
      username = userData.username;
    }

    const normalizedUsername = userData.username;


    const normalizedUserDataUsername = userData.username
      ? userData.username.trim().toUpperCase()
      : null;

    if (normalizedUsername !== normalizedUserDataUsername) {
      console.error("❌ 로그인한 사용자 정보를 찾을 수 없습니다.");
      return;
    }

    const { id, username: finalUsername, authority: userAuthority } = userData;

    // Set authority based on user's role
    const newAuthority = {
      isStudent: userAuthority === "ROLE_STUDENT",
      isTrainer: userAuthority === "ROLE_TRAINER",
      isAdmin: userAuthority === "ROLE_ADMIN",
    };

    setAuthority(newAuthority);
    localStorage.setItem("authority", JSON.stringify(newAuthority));



    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    setIsLogin(true);
    setUserInfo(userData); 

 
    const storedAnswers = localStorage.getItem("hbtiAnswers");


    if (storedAnswers) {
      console.log("📢 저장된 HBTI 데이터가 있습니다. 서버에 저장 중...");

      const parsedAnswers = JSON.parse(storedAnswers); 
      const answerArray = Object.values(parsedAnswers); 

      const requestBody = JSON.stringify({
        userId: id,
        answers: answerArray, 
      });

    

      try {
        const response = await fetch(
          `${import.meta.env.VITE_Server}/api/hbti/save`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: requestBody,
          }
        );

        if (response.ok) {
          console.log("✅ HBTI 데이터가 성공적으로 저장되었습니다.");
          localStorage.removeItem("hbtiAnswers"); 
          navigate(`/quiz/${id}/result`, { state: { fromLogin: true } });
          return;
        } else {
          console.error("❌ HBTI 데이터 저장 실패:", await response.text()); 
        }
      } catch (error) {
        console.error("❌ 서버에 HBTI 데이터 저장 중 오류 발생:", error);
      }
    } else {
      console.log("⚠ 저장된 HBTI 데이터가 없습니다.");
    }



    localStorage.setItem("isLogin", "true");
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  // 로그아웃 세팅
  const logoutSetting = () => {

    setIsLogin(false);
    setUserInfo(null);
    setAuthority(null);


    Cookies.remove("accessToken");
    api.defaults.headers.common.Authorization = undefined;


    localStorage.removeItem("isLogin");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("authority");
    localStorage.removeItem("username");


  };

  return (
    <LoginContext.Provider
      value={{
        isLogin,
        userInfo,
        authority,
        loginCheck,
        login,
        logout,
        stompClient: stompClient.current,
        unreadMessage: unreadMessage || {},
        setUnreadMessage,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
