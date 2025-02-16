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
import Headers from "../../common/component/Header";
import "../../mypage/static/css/Reset.css";
import ChatIcon from "../../common/component/ChatIcon";

const MyPage = () => {
  // const role = authInfo();
  const [user, setUser] = useState(null);
  const { authority, isLogin } = useContext(LoginContext);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("a");
  const navigate = useNavigate();

  //로그인 안 한 놈 쫒아내기
  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, []);

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

    api
      .get("/register/user", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
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
          <Container
            fluid
            className="vh-100 d-flex flex-column col-12"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "100px",
              marginBottom: "100px",
            }}
          >
            <Row className="col-12">
              {/* 왼쪽 프로필 영역 */}
              <Col
                md={4}
                sm={12}
                className="flex-column p-3 d-flex justify-content-start align-items-center mt-5"
              >
                <ProfileComponent user={user} onClick={handleCurrentPage} />
                <div>
                  <MypagePathButtenComponent
                    user={user}
                    onClick={handleCurrentPage}
                  />
                </div>
              </Col>

              {/* 오른쪽 메인 콘텐츠 영역 */}
              <Col
                md={8}
                sm={12}
                className="p-3 d-flex justify-content-center align-items-center"
              >
                <Routes>
                  {/* 트레이너일 경우 */}
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
                  ) : // 학생일 경우
                  authority.isStudent ? (
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
                    // 권한이 없을 경우
                    <Route index element={handleNoPermission()} />
                  )}
                </Routes>
              </Col>
            </Row>
          </Container>
          {/* NoPermissionModal */}
          <NoPermissionModal show={showModal} onClose={handleCloseModal} />
        </>
      ) : (
        <p>사용자 정보를 불러오는 중...</p>
      )}
    <ChatIcon />

    </EventProvider>
  );
};

export default MyPage;
