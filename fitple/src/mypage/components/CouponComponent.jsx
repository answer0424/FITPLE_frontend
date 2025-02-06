import React, { useContext, useEffect, useState } from "react";
import api from "../../mainpage/apis/api";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";

const CouponComponent = () => {
  const [ trainers, setTrainers] = useState();
  const { userInfo } = useContext(LoginContext);

  useEffect(()=>{
    const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];
    //페이지 최초 진입 시 트레이너 페이지 표시
    console.log(userInfo);
    api.get(`/member/${userInfo.id}/stamp`, {withCredentials: true, headers: {Authorization: `Bearer ${accessToken}`},})
    .then((response) => {
      console.log(response.data);
      setTrainers(response.data);
    })
  }, [])

  return (
    <>  
    <div>바뀔 트레이너
    <ul>
        {data.trainerIds.map((trainer, index) => (
          <li key={index}>
            <p><strong>Nickname:</strong> {trainer.nickname}</p>
            <p><strong>Profile Image:</strong> <img src={trainer.profileImage} alt={trainer.nickname} width={50} height={50} /></p>
            <p><strong>Gym Name:</strong> {trainer.gymName}</p>
          </li>
        ))}
      </ul>
    </div>
    <div>현재 트레이너
    <h2>Trainer Information</h2>
      <p>Nickname: {data.nickname}</p>
      <p>Gym: {data.gymName}</p>
      <p>Coupons: {data.coupons}</p>
      <p>Times: {data.times}</p>
    </div>
    </>
  );
};

export default CouponComponent;
