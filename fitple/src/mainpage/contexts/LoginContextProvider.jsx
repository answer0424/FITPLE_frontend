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
    if (stompClient.current) return; // 이미 연결되어 있을 경우를 방지

    const client = new Client({
      brokerURL: "ws://localhost:8081/ws-chat",
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
      console.log("채팅방 구독 유저 id", userInfo.id);
      const chatRooms = response;

      console.log("📌 구독할 채팅방 목록:", chatRooms);

      chatRooms.forEach((room) => {
        stompClient.current.subscribe(
          `/topic/chat/${room.chatId}`,
          (message) => {
            console.log(
              `💬 [${room.chatId}] 새 메시지 도착:`,
              JSON.parse(message.body)
            );
            console.log(JSON.parse(message.body).userId);

            if (JSON.parse(message.body).userId === userInfo.id) {
              console.log(
                "내가 보낸 메세지는 알림 안뜸",
                message.senderId,
                userInfo.id
              );
              return;
            }

            // ✅ 새로운 메시지를 상태에 반영하거나 UI에 알림 표시
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
      console.log("🛑 WebSocket Disconnected");
    }
  };

  useEffect(() => {
    if (isLogin) {
      connectWebSocket(); // 로그인 시 웹소켓 연결
    } else {
      disconnectWebSocket(); // 로그 아웃 시 웹소켓 해제
    }
  }, [isLogin]);

  // 로그인 확인
  const loginCheck = async (isAuthPage = false) => {
    const accessToken = Cookies.get("accessToken");

    console.log(`accessToken: ${accessToken}`);
    let response;
    let data;

    // 1-1. JWT(accessToken) 이 없고 인증이 필요 없다면
    if (!accessToken) {
      console.log("쿠키에 accessToken이 없습니다.");
      logoutSetting();
      return;
    }

    // 1-2. 인증이 필요한 페이지라면 로그인 페이지로 이동
    if (!accessToken && isAuthPage) {
      navigate("/login");
    }

    // 2. accessToken이 있다면
    console.log("쿠키에 accessToken이 있습니다.");
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    try {
      response = await auth.userInfo();
      console.log("response 뭐임??", response);
    } catch (error) {
      console.log(`error: ${error}`);
      return;
    }

    // 응답 실패 시
    if (!response) return;

    // user 정보 획득 성공
    console.log("JWT(accessToken)으로 사용자 인증 정보 요청 성공");

    data = response.data;
    console.log(`data: ${data}`);
    console.log("🔍 userData (JSON 변환):", JSON.stringify(data, null, 2));

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
    console.log(
      `로그인 요청 login(username:${username}, password:${password});`
    );

    try {
      const response = await auth.login(username, password);
      const { data, status, headers } = response;
      const { authorization } = headers; // 여기서 authorization 변수명을 제대로 입력

      const accessToken = authorization.replace("Bearer ", ""); // JWT 추출

      console.log(`-- login 요청응답 --
                data : ${data}
                status : ${status}
                headers : ${headers}
                jwt : ${accessToken}
            `);

      if (status === 200) {
        Cookies.set("accessToken", accessToken);

        // 로그인 세팅
        localStorage.setItem("username", username.toUpperCase());
        loginCheck(false); // username도 함께 전달

        // 시작 페이지 이동
        navigate("/");
      }
    } catch (error) {
      console.log(`로그인 error: ${error}`);
      alert("로그인 실패 아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  // 로그아웃
  const logout = (force = false) => {
    // confirm 없이 강제 로그아웃
    console.log("로그아웃");

    // confirm 받아서 로그아웃
    if (confirm("로그아웃 하시겠습니까?")) {
      logoutSetting();
      navigate("/");
    } else {
      return;
    }

    if (force) {
      // 로그아웃 세팅
      logoutSetting();
      navigate("/");
      return;
    }
  };

  const loginSetting = (
    userData,
    accessToken,
    username,
    provider,
    providerId
  ) => {
    console.log("📌 loginSetting() params:", username, provider, providerId);
    console.log("📝 userData:", userData);

    if (!userData) {
      console.error("🚨 userData가 비어있음!");
      return;
    }

    // OAuth 로그인 시 username이 없을 수도 있으므로 provider 기반으로 찾기
    if (
      !username &&
      userData.provider === provider &&
      userData.providerId === providerId
    ) {
      username = userData.username;
    }

    const normalizedUsername = userData.username;

    console.log("✅ 최종 username:", normalizedUsername);

    const normalizedUserDataUsername = userData.username
      ? userData.username.trim().toUpperCase()
      : null;

    if (normalizedUsername !== normalizedUserDataUsername) {
      console.error("❌ 로그인한 사용자 정보를 찾을 수 없습니다.");
      return;
    }

    const { id, username: finalUsername, authority } = userData;

    console.log(`✅ 로그인 성공!
            ID: ${id}
            Username: ${finalUsername}
            Authority: ${authority}
        `);

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    setIsLogin(true);
    setUserInfo(userData);

    const updatedAuthority = authority
      ? {
          isStudent: authority.includes("ROLE_STUDENT"),
          isTrainer: authority.includes("ROLE_TRAINER"),
          isAdmin: authority.includes("ROLE_ADMIN"),
        }
      : {
          isStudent: false,
          isTrainer: false,
          isAdmin: false,
        };
    setAuthority(updatedAuthority);

    navigate("/");
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("userInfo", JSON.stringify(userData));
    localStorage.setItem("authority", JSON.stringify(updatedAuthority));
  };

  // 로그아웃 세팅
  const logoutSetting = () => {
    // 상태 비우기
    setIsLogin(false);
    setUserInfo(null);
    setAuthority(null);

    // 쿠키 지우기
    Cookies.remove("accessToken");
    api.defaults.headers.common.Authorization = undefined;

    // 새로고침 시 localStorage 지우기
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
