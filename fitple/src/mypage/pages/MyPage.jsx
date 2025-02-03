import React, { useEffect, useState } from 'react';
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom'
import { Container } from 'react-bootstrap';
import TrainerComponent from '../components/trainer/TrainerComponent';
import StudentComponent from '../components/student/StudentComponent';
import NoPermissionModal from '../modal/NoPermissionModal';
import ProfileComponent from '../components/ProfileComponent';
import { authInfo } from '../../mainpage/apis/auth';
import axios from 'axios';
// import { getRole } from '../utill';

const MyPage = () => {
  // const role = authInfo();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) {
      console.error("액세스 토큰이 없습니다. 로그인이 필요합니다.");
      return;
    }
    
    axios.get(`${import.meta.env.VITE_Server}/register/user`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setUser(response.data.authority);
        console.log("가져온 사용자 정보:", response.data);
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 오류:", error);
        if (error.response?.status === 401) {
          alert("로그인이 필요합니다.");
          window.location.href = "/login";
        }
      });
  }, []);

  const handleNoPermission = () => {
    if (!showModal) {  setShowModal(true);  }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(-1);
  };

  // 권한에 따른 렌더링??
  if (user === null) {
    return <div>로딩 중...</div>; // 권한 정보가 아직 로드되지 않았다면 로딩 표시
  }

  return (
      <>
      <ProfileComponent/>
      <Container>
      <NoPermissionModal show={showModal} onClose={handleCloseModal} />
        <Routes>
          {user === 'ROLE_TRAINER' ? (
            <Route path='/member' element={<TrainerComponent />} />
          ) : user === 'ROLE_STUDENT' ? (
            <Route path='/member' element={<StudentComponent />} />
          ) : (
            <Route path='/member' element={handleNoPermission()} />
          )}
      </Routes>
      </Container>
      </>
  );
};

export default MyPage;
