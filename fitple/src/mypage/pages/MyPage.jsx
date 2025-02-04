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

    useEffect(() => {
      if (user) {
        // console.log("가져온 사용자:", user.authority);
      }
    }, [user]); // user가 변경될 때마다 해당 값을 출력

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
          <ProfileComponent user={user} />
          <Container>
            <NoPermissionModal show={showModal} onClose={handleCloseModal} />
            <Routes>
              {user.authority === 'ROLE_TRAINER' ? (
                <Route index element={<TrainerComponent user={user} />} />) : 
              user.authority === 'ROLE_STUDENT' ? (
                <Route index element={<StudentComponent user={user} />} />
              ) : user.authority === 'ROLE_ADMIN' ? (
                <Route path='/admin' element={<StudentComponent />} /> //차후 어드민 페이지 연결
              ) : (
                <Route index element={handleNoPermission()} />
              )}
            </Routes>
          </Container>
        </>
      ) : (
        <p>사용자 정보를 불러오는 중...</p>
      )}
    </div>
  )
  
}

  export default MyPage;
