import React, { useContext } from "react";
import "../static/css/Header.css";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";

const Header = () => {
  const { isLogin, logout } = useContext(LoginContext);

  const navigate = useNavigate();

  return (
    <div>
      <div className="header">
        <Link to={"/quiz"} className="header-left en-font">
          HBTI
        </Link>
        <Link to={"/"}>
          <img src={logo} alt="Logo" className="header-image" />
        </Link>
        {/* 로그인 상태에 따라 버튼 변경 */}
        {isLogin ? (
          <Link to={"/member"} className="header-right en-font">
            MYPAGE
          </Link>
        ) : (
          <Link to={"/login"} className="header-right en-font">
            LOGIN
          </Link>
        )}
        {isLogin ? (
          <Link
            onClick={() => {
              logout(false);
            }}
          >
            <i className="bi bi-box-arrow-right logout"></i>
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Header;
