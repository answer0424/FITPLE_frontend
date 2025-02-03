import React from 'react';
import '../css/Header.css';

import logo from '../../assets/logo.png'; 

import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div>
            <div className="header">
                <Link to={"/"} className="header-left">HBTI</Link>
                <Link to={"/"}>
                    <img src={logo} alt="Logo" className='header-image'/>
                </Link>
                <Link to={"/login"} className="header-right">LOGIN</Link>
            </div>
        </div>
    );
};

export default Header;