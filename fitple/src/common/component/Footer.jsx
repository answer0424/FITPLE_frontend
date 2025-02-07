import React from 'react';
import '../css/Footer.css'
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div>
            <div className="footer-container">
                <div className="footer-line">
                    <div className="footer-circle"></div>
                </div>
                    <div className="footer-text">FITPLE</div>
                    <div className='row'>
                        <div className='footer-menu'>
                            <Link to={"/"}>HBTI TEST</Link>
                            <Link to={"/"}>About HBTI</Link>
                            <Link to={"/"}>Login</Link>
                        </div>
                        <div className='github'>
                            <a href="">이경원</a>
                            <a href="">이동희</a>
                            <a href="">김범순</a>
                            <a href="">현지윤</a>
                            <a href="">박준우</a>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default Footer;