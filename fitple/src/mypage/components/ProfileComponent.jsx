import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../mainpage/apis/api";
import { Button } from "react-bootstrap";
import { Container, Row, Col } from 'react-bootstrap';
import { GearFill } from "react-bootstrap-icons"; // 설정 아이콘
import "../static/css/ProfileComponent.css";

const ProfileComponent = ({ user, onClick }) => {
  const [userInfo, setUserInfo] = useState(null);
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
          <GearFill className="settings-icon" />
          </div>

          <h2 className="nickname">{userInfo.nickname}</h2>

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
