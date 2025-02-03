import React, { useState } from 'react';
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom'
import { Container } from 'react-bootstrap';
import TrainerComponent from '../components/trainer/TrainerComponent';
import StudentComponent from '../components/student/StudentComponent';
import NoPermissionModal from '../modal/NoPermissionModal';
import ProfileComponent from '../components/ProfileComponent';
import { getRole } from '../utill';

const MyPage = () => {
  const role = getRole();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleNoPermission = () => {
    if (!showModal) {  setShowModal(true);  }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(-1);
  };

  return (
      <>
      <ProfileComponent/>
      <Container>
      <NoPermissionModal show={showModal} onClose={handleCloseModal} />
        <Routes>
          {role === 'trainer' ? (
            <Route path='/member' element={<TrainerComponent />} />
          ) : role === 'student' ? (
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
