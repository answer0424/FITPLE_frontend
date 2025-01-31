import React, { useContext } from 'react';
import '../css/Header.css';
import logo from '../../assets/logo.png'; 
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../../mainpage/contexts/LoginContextProvider';

const Header = () => {

    const { isLogin, logout } = useContext(LoginContext);

    const navigate = useNavigate();
    

    return (
        <div>
            <div className="header">
                <Link to={"/"} className="header-left">HBTI</Link>
                <Link to={"/"}>
                    <img src={logo} alt="Logo" className='header-image'/>
                </Link>
                 {/* 로그인 상태에 따라 버튼 변경 */}
                 {isLogin ? (
                    <Link to={"/"} className="header-right" onClick={logout}>LOGOUT</Link>
                ) : (
                    <Link to={"/login"} className="header-right">LOGIN</Link>
                )}
            </div>
        </div>
    );
};

export default Header;