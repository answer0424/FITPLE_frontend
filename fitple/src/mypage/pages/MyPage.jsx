import React, { useContext, useEffect, useState } from 'react';
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom'
import { Container, Row, Col } from "react-bootstrap";
import TrainerComponent from '../components/trainer/TrainerComponent';
import StudentComponent from '../components/student/StudentComponent';
import NoPermissionModal from '../modal/NoPermissionModal';
import ProfileComponent from '../components/ProfileComponent';
import axios from 'axios';
import MypagePathButtenComponent from '../components/MypagePathButtenComponent';
import { LoginContext } from '../../mainpage/contexts/LoginContextProvider';
  // import { getRole } from '../utill';

  const MyPage = () => {
    // const role = authInfo();
    const [user, setUser] = useState(null);
    const { userInfo } = useContext(LoginContext);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState("a");
    const navigate = useNavigate();

    useEffect(() => {
      console.log(userInfo.authorities);
    }, []);

    const handleCurrentPage = (page) => {
      setCurrentPage(page); // 버튼 클릭에 따라 currentPage 상태 변경
    };

    const handleNoPermission = () => {
      if (!showModal) {  setShowModal(true);  }
    };

    const handleCloseModal = () => {
      setShowModal(false);
      navigate('/login');
    };

    return(
      <div>
      {userInfo ? (
        <>
          <Container fluid className="vh-100">
            <Row>
              <Col md={4} className="flex-column p-3 d-flex justify-content-center align-items-center">
                <div className="vh-60">
                  <ProfileComponent user={userInfo} />
                </div>
                <div className="vh-40">
                  <MypagePathButtenComponent user={userInfo} onClick={handleCurrentPage}/>
                </div>
              </Col>
              <Col md={8} className="vh-100 p-3 d-flex justify-content-center align-items-center">
                <NoPermissionModal show={showModal} onClose={handleCloseModal} />
                <Routes>
                  {userInfo.authorities === "ROLE_TRAINER" ? (
                    <Route index element={<TrainerComponent user={userInfo} currentPage={currentPage} />} />
                  ) : userInfo.authorities === "ROLE_STUDENT" ? (
                    <Route index element={<StudentComponent user={userInfo} currentPage={currentPage} />} />
                  ) : userInfo.authorities === "ROLE_ADMIN" ? (
                    <Route path="/admin" element={<StudentComponent />} /> // 어드민 페이지 연결 예정
                  ) : (
                    <Route index element={handleNoPermission()} />
                  )}
                </Routes>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <p>사용자 정보를 불러오는 중...</p>
      )}
    </div>
  )
  
}

  export default MyPage;
