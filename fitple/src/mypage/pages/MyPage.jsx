  import React, { useEffect, useState } from 'react';
  import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom'
  import { Container, Row, Col } from "react-bootstrap";
  import TrainerComponent from '../components/trainer/TrainerComponent';
  import StudentComponent from '../components/student/StudentComponent';
  import NoPermissionModal from '../modal/NoPermissionModal';
  import ProfileComponent from '../components/ProfileComponent';
  import { authInfo } from '../../mainpage/apis/auth';
  import axios from 'axios';
import MypagePathButtenComponent from '../components/MypagePathButtenComponent';
  // import { getRole } from '../utill';

  const MyPage = () => {
    // const role = authInfo();
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState("a");
    const navigate = useNavigate();

    useEffect(() => {      
      const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      // console.log(`${import.meta.env.VITE_Server}/register/user`);

      axios.get(`${import.meta.env.VITE_Server}/register/user`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        // console.log("가져온 사용자 정보:", response.data);
        // console.log("가져온 사용자 정보:", typeof(user));
        // console.log("가져온 사용자 정보:", user);
      })
      .catch((error) => {
        // console.error("사용자 정보 가져오기 오류:", error);
        setUser(1);
      });

      if (!accessToken) {
        return;
      }
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
      {user ? (
        <>
          <Container fluid className="vh-100">
            <Row>
              <Col md={4} className="flex-column p-3 d-flex justify-content-center align-items-center">
                <div className="vh-60">
                  <ProfileComponent user={user} />
                </div>
                <div className="vh-40">
                  <MypagePathButtenComponent user={user} onClick={handleCurrentPage}/>
                </div>
              </Col>
              <Col md={8} className="vh-100 p-3 d-flex justify-content-center align-items-center">
                <NoPermissionModal show={showModal} onClose={handleCloseModal} />
                <Routes>
                  {user.authority === "ROLE_TRAINER" ? (
                    <Route index element={<TrainerComponent user={user} currentPage={currentPage} />} />
                  ) : user.authority === "ROLE_STUDENT" ? (
                    <Route index element={<StudentComponent user={user} currentPage={currentPage} />} />
                  ) : user.authority === "ROLE_ADMIN" ? (
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
