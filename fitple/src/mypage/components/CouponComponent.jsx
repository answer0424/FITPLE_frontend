import React, { useContext, useEffect, useState } from "react";
import api from "../../mainpage/apis/api";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";
import { Button } from "react-bootstrap";

const CouponComponent = () => {
  const [trainers, setTrainers] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const { userInfo } = useContext(LoginContext);

  useEffect(()=>{
    //페이지 최초 진입 시 트레이너 페이지 표시
    const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];
    console.log(userInfo.id);
    
    api.get(`/member/${userInfo.id}/stamp`, {withCredentials: true, headers: {Authorization: `Bearer ${accessToken}`},})
    .then((response) => {
      console.log(response.data);
      if(!trainers) setTrainers(response.data.trainerIds);

      setSelectedTrainer({
        coupons: response.data.coupons,
        gymName: response.data.gymName,
        nickname: response.data.nickname,
        times: response.data.times,
        trainerId: response.data.trainerId,
      })
    })
  }, [])

  const useCoupon = (() => {
    const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];
    //쿠폰 사용
    console.log("작동은 함")
    console.log(userInfo.id, trainers.trainerId)
    api.patch(`/member/use-coupons`,
      {
        studentId: userInfo.id,
        trainerId: trainers.trainerId,
      },
      {withCredentials: true, headers: {Authorization: `Bearer ${accessToken}`},})
    .then((response) => {
      console.log(response.data);
    })
  })

  const changeTrainer = ((trainerId) => {
    const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];
    api.get(`/member/${userInfo.id}/stamp/trainer/${trainerId}`,{withCredentials: true, headers: {Authorization: `Bearer ${accessToken}`},})
    .then((response) => {
      console.log(response.data);
      setSelectedTrainer({
        coupons: response.data.coupons,
        gymName: response.data.gymName,
        nickname: response.data.nickname,
        times: response.data.times,
        trainerId: response.data.trainerId,
      })
    })
  })

  

  return (
    (trainers && Array.isArray(trainers)) ? (
      <>
        <div>
          <h2>바뀔 트레이너</h2>
          <ul>
            {trainers.map((trainer) => (
              <li key={trainer.trainerId}>
                <Button onClick={() => changeTrainer(trainer.trainerId)}>
                  {trainer.nickname}
                </Button>
              </li>
            ))}
          </ul>
        </div>
        {selectedTrainer ? (
          <div>
            <h2>현재 트레이너</h2>
            <p><strong>Nickname:</strong> {selectedTrainer.nickname}</p>
            <p><strong>Gym:</strong> {selectedTrainer.gymName}</p>
            <p><strong>Coupons:</strong> {selectedTrainer.coupons}</p>
            <p><strong>Times:</strong> {selectedTrainer.times}</p>
            <Button onClick={useCoupon}>쿠폰 사용</Button>
          </div>
        ) : (
          <div>데이터를 로드하는 중입니다...</div>
        )}
      </>
    ) : (
      <div>데이터를 로드하는 중입니다...</div>
    )
  );
  
};

export default CouponComponent;
