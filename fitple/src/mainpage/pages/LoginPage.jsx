// LoginForm.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../common/component/Header";
import "../assets/styles/App.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert("Login submitted successfully!");
    console.log("User Data:", { email, password });
  };

  return (
    <div className="App">
      <Header />
      <div className="question-container">
        <h2>Login</h2>
        <div className="input-container">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="forgot-password-link">
            <button onClick={() => alert("Forgot Password?")}>
              Forgot Password?
            </button>
          </div>
          <div className="button-container">
            <button onClick={handleLogin}>Login</button>
          </div>
          <div className="login-box">
            <a href="#" className="social-button" id="kakao-connect">
              {" "}
              <span>Connect with Kakao</span>
            </a>
            <a href="#" className="social-button" id="google-connect">
              {" "}
              <span>Connect with Google</span>
            </a>
            <a href="#" className="social-button" id="naver-connect">
              {" "}
              <span>Connect with Naver</span>
            </a>
          </div>
          <div className="signup-link">
            <Link to="/signUp/user">
              <button>Don't have an account? Sign Up</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
