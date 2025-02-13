import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../mainpage/apis/api";
import { Button } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { GearFill, HouseFill } from "react-bootstrap-icons"; // 설정 및 집 아이콘
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";
import "../static/css/ProfileComponent.css";

const ProfileComponent = ({ user, onClick }) => {
  // const [userInfo, setUserInfo] = useState(null);
  const { userInfo, authority } = useContext(LoginContext);
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  // useEffect(() => {
  //   const accessToken = document.cookie
  //     .split("; ")
  //     .find((row) => row.startsWith("accessToken="))
  //     ?.split("=")[1];

  //   api
  //     .get(`/member/${user.id}/info`, {
  //       withCredentials: true,
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //     })
  //     .then((response) => {
  //       setUserInfo(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("사용자 정보 가져오기 실패:", error);
  //       navigate("/");
  //     });
  // }, [user]);

  //프로필 변경으로 이동
  const handleClick = (type) => {
    setActive(type);
    onClick(type);
  };

  // 트레이너 홈으로 이동하는 함수
  const goToTrainerHome = () => {
    navigate(`/trainer/${user.id}/detail`); // 이동할 경로 설정
  };

  const goToHbtiTest = () => {
    navigate("/quiz");
  };

  return (
    <div className="profile-container d-flex justify-content-center align-items-center">
      {userInfo ? (
        <>
          <Row className="w-100">
            <Col className="d-flex flex-column align-items-center">
              {/* 프로필 이미지와 설정 아이콘 */}
              <div className="profile-image-container position-relative">
                <img
                  src={`${import.meta.env.VITE_Server}/${
                    userInfo.profileImage
                  }`}
                  alt="Profile"
                  className="profile-image"
                />
                <button
                  onClick={() => handleClick("c")}
                  className="settings-icon"
                >
                  <GearFill className="settings-icon" />
                </button>
              </div>

              {/* 닉네임과 집 아이콘 */}
              <div className="nickname-container text-center mt-3">
                <h2 className="nickname">{userInfo.nickname}</h2>
                {authority.isTrainer && (
                  <HouseFill className="home-icon" onClick={goToTrainerHome} />
                )}
              </div>

              {userInfo.hbti ? (
                <p className="hbti mt-2">{userInfo.hbti.hbti}</p>
              ) : (
                <Button
                  style={{ backgroundColor: "white", color: "black" }}
                  className="mt-2"
                  onClick={goToHbtiTest}
                >
                  HBTI테스트
                </Button>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <p className="loading-text">사용자 정보를 불러오는 중...</p>
      )}
    </div>
  );
};

export default ProfileComponent;
