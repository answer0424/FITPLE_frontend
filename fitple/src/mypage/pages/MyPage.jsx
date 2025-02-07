import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import TrainerComponent from "../components/trainer/TrainerComponent";
import StudentComponent from "../components/student/StudentComponent";
import NoPermissionModal from "../modal/NoPermissionModal";
import ProfileComponent from "../components/ProfileComponent";
import api from "../../mainpage/apis/api";
import MypagePathButtenComponent from "../components/MypagePathButtenComponent";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";
import { EventProvider } from "../context/EventContext";

const MyPage = () => {
  // const role = authInfo();
  const [user, setUser] = useState(null);
  const { authority, isLogin } = useContext(LoginContext);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("a");
  const navigate = useNavigate();
  console.log("authority : ", authority);

  //관리자 이동
  useEffect(() => {
    if (isLogin && authority.isAdmin) {
      navigate("/admin");
    }
  }, []);

  useEffect(() => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) {
      return;
    }
    // console.log(`${import.meta.env.VITE_Server}/register/user`);

    //TODO 유저 정보 읽어오기. useContext 정상화 시 삭제
    api
      .get("/register/user", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        // console.log(response.data.id);
        setUser(response.data);
      });
  }, []);

  const handleCurrentPage = (page) => {
    setCurrentPage(page); // 버튼 클릭에 따라 currentPage 상태 변경
  };

  const handleNoPermission = () => {
    if (!showModal) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <EventProvider>
      {user ? (
        <>
          <Container className="vh-100">
            <Row>
              <Col
                md={4}
                className="flex-column p-3 d-flex justify-content-center align-items-center"
              >
                <div className="vh-60">
                  <ProfileComponent user={user} />
                </div>
                <div className="vh-40">
                  <MypagePathButtenComponent
                    user={user}
                    onClick={handleCurrentPage}
                  />
                </div>
              </Col>
              <Col
                md={8}
                className="vh-100 p-3 d-flex justify-content-center align-items-center"
              >
                <NoPermissionModal
                  show={showModal}
                  onClose={handleCloseModal}
                />
                <Routes>
                  {authority.isTrainer ? (
                    <Route
                      index
                      element={
                        <TrainerComponent
                          user={user}
                          currentPage={currentPage}
                        />
                      }
                    />
                  ) : authority.isStudent ? (
                    <Route
                      index
                      element={
                        <StudentComponent
                          user={user}
                          currentPage={currentPage}
                        />
                      }
                    />
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
    </EventProvider>
  );
};

export default MyPage;
