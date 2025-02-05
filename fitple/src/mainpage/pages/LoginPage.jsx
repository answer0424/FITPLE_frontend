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

  const { login, loginCheck} = useContext(LoginContext);

  const onLogin = (e) => {
    e.preventDefault();

<<<<<<< HEAD
    login(username, password, rememberUserId); // 로그인 진행
  };
=======
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    
    login(username, password);  // 로그인 진행
  }
>>>>>>> 05d2bd953d465278320255115434acb511e06933

  useEffect(() => {
    console.log('LoginContextProvider 마운트 됨')

    

    // 쿠키에 저장된 아이디 가져오기
    const rememberId = Cookies.get("rememberId");
    console.log(`쿠키 rememberId : ${rememberId}`);
    setRememberUserId(rememberId);
  }, []);

  const handleLogin = () => {
    alert("Login submitted successfully!");
    console.log("User Data:", { email: username, password });
  };

  // oauth
  const onKakaoLogin = () => {
<<<<<<< HEAD
    window.location.href = `${
      import.meta.env.VITE_Server
    }/oauth2/authorization/kakao`;
    console.log("kakao oauth 로그인");
  };

  const onGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_Server
    }/oauth2/authorization/google`;
    console.log("google oauth 로그인");
  };

  const onNaverLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_Server
    }/oauth2/authorization/naver`;
    console.log("naver oauth 로그인");
  };

  const handleClick = () => {
    alert("Forgot Password?");
    navigate("/reset-password");
=======
    window.location.href = `${import.meta.env.VITE_Server}/oauth2/authorization/kakao`;
    console.log('kakao oauth 로그인');
    
  };

  const onGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_Server}/oauth2/authorization/google`;
    console.log('google oauth 로그인');
    
  };

  const onNaverLogin = () => {
    window.location.href = `${import.meta.env.VITE_Server}/oauth2/authorization/naver`;
    console.log('naver oauth 로그인');
    
>>>>>>> 05d2bd953d465278320255115434acb511e06933
  };

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
<<<<<<< HEAD
            <div className="forgot-password-link">
              <button onClick={handleClick}>Forgot Password?</button>
            </div>
=======
>>>>>>> 05d2bd953d465278320255115434acb511e06933
            <div className="button-container">
              <button type="submit">Login</button>
            </div>
          </form>
          <div className="forgot-password-link">
            <button onClick={() => alert("Forgot Password?")}>
              Forgot Password?
            </button>
          </div>
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
