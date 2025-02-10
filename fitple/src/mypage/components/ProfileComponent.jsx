import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../mainpage/apis/api";
import { Button } from "react-bootstrap";
import { GearFill, HouseFill } from "react-bootstrap-icons"; // 설정 및 집 아이콘
import "../static/css/ProfileComponent.css";

const ProfileComponent = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

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

  // 트레이너 홈으로 이동하는 함수
  const goToTrainerHome = () => {
    navigate(`/trainer/${user.id}/detail`); // 이동할 경로 설정
  };

  return (
    <div className="profile-container">
      {userInfo ? (
        <>
          {/* 프로필 이미지 */}
          <div className="profile-image-container">
            <img
              src={`${import.meta.env.VITE_Server}/${userInfo.profileImage}`}
              alt="Profile"
              className="profile-image"
            />
            <GearFill className="settings-icon" />
          </div>

          {/* 닉네임 & 집 아이콘 */}
          <div className="nickname-container">
            <h2 className="nickname">{userInfo.nickname}</h2>
            <HouseFill className="home-icon" onClick={goToTrainerHome} />
          </div>

          {/* HBTI */}
          <p className="hbti">{userInfo.hbti}</p>
        </>
      ) : (
        <p className="loading-text">사용자 정보를 불러오는 중...</p>
      )}
    </div>
  );
};

export default ProfileComponent;
