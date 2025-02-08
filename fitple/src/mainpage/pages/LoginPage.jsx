import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../common/component/Header";
import "../assets/styles/App.css";
import { LoginContext } from "../contexts/LoginContextProvider";
import Cookies from "js-cookie";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberUserId, setRememberUserId] = useState();

  const { login, loginCheck, handleOAuthLogin } = useContext(LoginContext);

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const success = await login(username, password);
      console.log("Login success:", success); // 디버깅용
      if (success === true) {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    console.log("LoginContextProvider 마운트 됨");
    const rememberId = Cookies.get("rememberId");
    console.log(`쿠키 rememberId : ${rememberId}`);
    setRememberUserId(rememberId);
  }, []);

  const handleClick = () => {
    alert("Login submitted successfully!");
    console.log("User Data:", { email: username, password });

    // 비밀번호찾기 페이지 네비게이션
    const navigate = useNavigate();
  };
  const gotoResetPassword = () => {
    alert("비밀번호을 잊으셨습니까");
    navigate("/forgot-password");
  };

  // OAuth 로그인 핸들러
  const onKakaoLogin = () => handleOAuthLogin("kakao");
  const onGoogleLogin = () => handleOAuthLogin("google");
  const onNaverLogin = () => handleOAuthLogin("naver");

  return (
    <div className="App">
      <Header />
      <div className="question-container">
        <h2>Login</h2>
        <div className="input-container">
          <form onSubmit={onLogin}>
            <input
              type="text"
              name="username"
              placeholder="Enter your id"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="forgot-password-link">
              <button type="button" onClick={gotoResetPassword}>
                Forgot Password?
              </button>
            </div>
            <div className="button-container">
              <button type="submit">Login</button>
            </div>
          </form>
          <div className="login-box">
            <button
              className="social-button"
              id="kakao-connect"
              onClick={onKakaoLogin}
            >
              <span>Connect with Kakao</span>
            </button>
            <button
              className="social-button"
              id="google-connect"
              onClick={onGoogleLogin}
            >
              <span>Connect with Google</span>
            </button>
            <button
              className="social-button"
              id="naver-connect"
              onClick={onNaverLogin}
            >
              <span>Connect with Naver</span>
            </button>
          </div>
          <div className="signup-link">
            <Link to="/register/student">
              <button>Don't have an account? Sign Up</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
