import React, { useContext } from 'react';
import Header from '../../common/component/Header';
import '../assets/styles/MainPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';
import sectionImg from './../assets/images/sectionImg.png';
import Footer from '../../common/component/Footer';
import ChatIcon from '../../common/component/ChatIcon';
import '../../common/css/Font.css';

const MainPage = () => {
    const navigate = useNavigate();

    const { isLogin, userInfo } = useContext(LoginContext); // userInfo 추가



    // HBTI test로 이동
    const gotoTest = () => {
        navigate('/quiz');
    };

    // HBTI detail로 이동
    const goHBTI = () => {
        navigate('/hbti');
    };

    // matchPage로 이동
    const goMatching = () => {
        if (!isLogin) {  // matchPage도 로그인 필요하다면 이렇게 추가
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }


        if (userInfo?.id) {
            navigate(`/quiz/${userInfo.id}/result/match`); // userInfo.id를 URL에 동적으로 추가
        } else {
            alert('로그인 정보를 확인할 수 없습니다.');
        }
    };


    return (
        <div className='mainPage'>
            <Header />
            <div className="HBTI-test-container">
                <h1 className='en-font'>HBTI</h1>
                <p className='kr-font'>나의 운동 성향 확인하기</p>
                <button onClick={gotoTest} className='en-font'>Test</button>
            </div>
            <div className='section'>
                <div className='background-image'></div>
                <div className="about-HBTI-container">
                    <div>
                        <h2 className='en-font'>Learn About HBTI</h2>
                        <p className='kr-font'>FITPLE과 함께 HBTI에 대한 정보를 얻고 사용자의 운동 성향을 테스트 해보세요!</p>
                        <p className='kr-font'>HBTI를 통해 자신의 운동 성향을 알 수 있습니다.</p>
                        <button onClick={goHBTI} className='en-font'>GO TO HBTI</button>
                    </div>
                    <img src={sectionImg} alt="HBTI Image"/>
                </div>

                <div className="match-trainer-container">
                    <div>
                        <h2 className='en-font'>Recommend Trainer</h2>
                        <p className='kr-font'>FITPLE과 함께 자신에게 맞는 트레이너를 찾고 운동 능력을 향상시켜보세요!</p>
                        <p className='kr-font'>자신과 맞는 트레이너와 함께했을 때 최적의 운동 능력을 발휘할 수 있습니다.</p>
                        <button onClick={goMatching} className='en-font'>MATCH TRAINER</button>
                    </div>
                    <img src={sectionImg} alt="Trainer Match Image"/>
                </div>
                <Footer/>
                {isLogin && <ChatIcon />}
            </div>
        </div>
    );
};

export default MainPage;
