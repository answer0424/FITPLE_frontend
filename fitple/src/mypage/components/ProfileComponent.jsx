import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../mainpage/apis/api";
import { Button } from "react-bootstrap";
import { Container, Row, Col } from 'react-bootstrap';
import { GearFill, HouseFill } from "react-bootstrap-icons"; // 설정 및 집 아이콘
import "../static/css/ProfileComponent.css";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";

const ProfileComponent = ({ user, onClick }) => {
  const [userInfo, setUserInfo] = useState(null);
  // const { userInfo } = useContext(LoginContext);
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  useEffect(() => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    api
      .get(`/member/${user.id}/info`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 실패:", error);
        navigate("/");
      });
  }, [user]);


  //프로필 변경으로 이동
  const handleClick = (type) => {
    setActive(type);
    onClick(type);
  };

  // 트레이너 홈으로 이동하는 함수
  const goToTrainerHome = () => {
    navigate(`/trainer/${user.id}/detail`); // 이동할 경로 설정
  };

  return (
    <div className="profile-container">
      {userInfo ? (
        <>
        <Row className="w-100">
        <Col xs={12} className="d-flex flex-column">
          <div className="profile-image-container">
            <img
              src={`${import.meta.env.VITE_Server}/${userInfo.profileImage}`}
              alt="Profile"
              className="profile-image"
            />
            {/* 이 버튼과 GearFill에 적용된 클래스 네임은 css 수정하며 손 볼 것 */}
          <button onClick={() => handleClick("c")} className="settings-icon"> 
            <GearFill className="settings-icon" />
          </button>
          </div>

          {/* 닉네임 & 집 아이콘 */}
          <div className="nickname-container">
            <h2 className="nickname">{userInfo.nickname}</h2>
            <HouseFill className="home-icon" onClick={goToTrainerHome} />
          </div>

          <p className="hbti">{userInfo.hbti}</p>

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
