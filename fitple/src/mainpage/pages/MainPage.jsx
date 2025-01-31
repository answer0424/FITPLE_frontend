import React from 'react';
import Header from '../../common/component/Header';
import '../assets/styles/MainPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const MainPage = () => {
    return (
        <>
            <Header />
            <div className="HBTI-test-container">
                <h1>HBTI</h1>
                <p>나의 운동 성향 확인하기</p>
                <button>Test</button>
            </div>
            <div className='section'>
            <div className='background-image'></div>
                <div className="about-HBTI-container">
                    <div>
                        <h2>Learn About HBTI</h2>
                        <p>FITPLE과 함께 HBTI에 대한 정보를 얻고 사용자의 운동 성향을 테스트 해보세요!</p>
                        <p>HBTI를 통해 자신의 운동 성향을 알 수 있습니다.</p>
                        <button>GO TO HBTI</button>
                    </div>
                    <img src="YOUR_IMAGE_URL" alt="HBTI Image"/>
                </div>

                <div className="match-trainer-container">
                    <div>
                        <h2>Recommend Trainer</h2>
                        <p>FITPLE과 함께 자신에게 맞는 트레이너를 찾고 운동 능력을 향상시켜보세요!</p>
                        <p>자신과 맞는 트레이너와 함께했을 때 최적의 운동 능력을 발휘할 수 있습니다.</p>
                        <button>MATCH TRAINER</button>
                    </div>
                    <img src="YOUR_IMAGE_URL" alt="Trainer Match Image"/>
                </div>
            </div>
            <div class="footer-container">
                <div class="footer-line">
                    <div class="footer-circle"></div>
                </div>
                <div class="footer-text">FITPLE</div>
                <Link to={"/"}>HBTI TEST</Link>
                <Link to={"/"}>About HBTI</Link>
                <Link to={"/"}>MyPage</Link>
            </div>
        </>
    );
};

export default MainPage;
