import React from 'react';
import Header from '../../common/component/Header';
import '../assets/styles/MainPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import sectionImg from './../assets/images/sectionImg.png'
import Footer from '../../common/component/Footer';
import ChatIcon from '../../common/component/ChatIcon';

const MainPage = () => {

    const navigate = useNavigate();

    // HBTI test로 이동
    const gotoTest = () => {
        navigate('/');
    }

    // HBTI detail로 이동
    const goHBTI = () => {
        navigate('/');
    }

    // matchPage로 이동
    const goMatching = () => {
        navigate('/');
    }

    return (
        <>
            <Header />
            <div className="HBTI-test-container">
                <h1>HBTI</h1>
                <p>나의 운동 성향 확인하기</p>
                <button onClink={gotoTest}>Test</button>
            </div>
            <div className='section'>
            <div className='background-image'></div>
                <div className="about-HBTI-container">
                    <div>
                        <h2>Learn About HBTI</h2>
                        <p>FITPLE과 함께 HBTI에 대한 정보를 얻고 사용자의 운동 성향을 테스트 해보세요!</p>
                        <p>HBTI를 통해 자신의 운동 성향을 알 수 있습니다.</p>
                        <button onClick={goHBTI}>GO TO HBTI</button>
                    </div>
                    <img src={sectionImg} alt="HBTI Image"/>
                </div>

                <div className="match-trainer-container">
                    <div>
                        <h2>Recommend Trainer</h2>
                        <p>FITPLE과 함께 자신에게 맞는 트레이너를 찾고 운동 능력을 향상시켜보세요!</p>
                        <p>자신과 맞는 트레이너와 함께했을 때 최적의 운동 능력을 발휘할 수 있습니다.</p>
                        <button onClick={goMatching}>MATCH TRAINER</button>
                    </div>
                    <img src={sectionImg} alt="Trainer Match Image"/>
                </div>
                <Footer/>
                <ChatIcon/>
            </div>
        </>
    );
};

export default MainPage;
