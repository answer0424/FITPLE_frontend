import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../mainpage/apis/api";

const ProfileComponent = ({ user }) => {

  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

    // console.log("유저 정보 " + JSON.stringify(user));
    // console.log("유저 아이디 " + JSON.stringify(user.id));
    // console.log("url " + `${import.meta.env.VITE_Server}/member/${user.id}/info`);
    api.get(`/member/${user.id}/info`, {withCredentials: true, headers: {Authorization: `Bearer ${accessToken}`,},})
    .then((response) => {
      console.log(response.data);
      // console.log(typeof(response.data));
      setUserInfo(response.data);
    })
    .catch((error) => {
      console.log("에러");
      console.error(error.message);
      navigate('/')
    })
  }, [user])

  return (
  <div>
    {userInfo ? (
      <>
      <h1>User Profile</h1>
      <div>
        <p><strong>User ID:</strong> {userInfo.userId}</p>
        <p><strong>Nickname:</strong> {userInfo.nickname}</p>
        <p><strong>Profile Image:</strong> <img src={userInfo.profileImage} alt="Profile" width="100" /></p>
        (userInfo.hbti ? () : ())
        {/* <p><strong>HBTI:</strong> {userInfo.hbti}</p> */}
        <p><strong>Address:</strong> {userInfo.address}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Birth:</strong> {userInfo.birth}</p>
      </div>
      </>
    ) : (
        <p>사용자 정보를 불러오는 중...</p>
      )}
  </div>
  );
};

export default ProfileComponent;
