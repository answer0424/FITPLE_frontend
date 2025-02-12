import React, { useContext, useEffect, useState } from "react";
import api from "../../../mainpage/apis/api";
import { LoginContext } from "../../../mainpage/contexts/LoginContextProvider";
import { Button } from "react-bootstrap";
// import { error } from "jquery";
import "../../static/css/Coupon.css";
import { MenuButtonWide } from "react-bootstrap-icons";

const CouponComponent = () => {
  const [trainers, setTrainers] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const { userInfo } = useContext(LoginContext);

  useEffect(() => {
    //페이지 최초 진입 시 트레이너 페이지 표시
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
    console.log(userInfo.id);

    api
      .get(`/member/${userInfo.id}/stamp`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log(response.data);
        if (!trainers) setTrainers(response.data.trainerIds);

        setSelectedTrainer({
          coupons: response.data.coupons,
          gymName: response.data.gymName,
          nickname: response.data.nickname,
          times: response.data.times,
          trainerId: response.data.trainerId,
        });
      });
  }, []);

  const useCoupon = () => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
    //쿠폰 사용
    console.log("작동은 함");
    console.log(userInfo.id, selectedTrainer.trainerId);
    api
      .patch(
        `/member/use-coupons`,
        {
          studentId: userInfo.id,
          trainerId: selectedTrainer.trainerId,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        console.log(response.data);
        confirm("쿠폰을 정말 사용하시겠습니다.");
        setSelectedTrainer((prevState) => ({
          ...prevState,
          coupons: prevState.coupons - 1,
          times: prevState.times + 1,
          gymName: prevState.gymName,
          nickname: prevState.nickname,
          trainerId: prevState.trainerId,
        }));
      })
      .catch((error) => {
        alert("쿠폰개수를 확인해주세요");
        console.log(error.response.data);
      });
  };

  const changeTrainer = (trainerId) => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
    api
      .get(`/member/${userInfo.id}/stamp/trainer/${trainerId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log(response.data);
        setSelectedTrainer({
          coupons: response.data.coupons,
          gymName: response.data.gymName,
          nickname: response.data.nickname,
          times: response.data.times,
          selectedTrainerId: response.data.trainerId,
          trainerId: response.data.trainerId,
        });
      });
  };

  return trainers && Array.isArray(trainers) ? (
    <>
      <div className="coupon-component-container">
        <h2 className="coupon-title" style={{ color: "black" }}>
          Trainer
        </h2>
        <div className="coupon-trainer-list">
          {trainers &&
            trainers.map((trainer) => (
              <button
                key={trainer.trainerId}
                className="coupon-trainer-button"
                onClick={() => changeTrainer(trainer.trainerId)}
                style={{
                  color: "white",
                  width: "100px",
                  flex: "0",
                  padding: "10px",
                }}
              >
                {trainer.nickname}
              </button>
            ))}
        </div>
        <h2 className="title" style={{ color: "black" }}>
          Information
        </h2>
        {selectedTrainer ? (
          <div className="coupon-trainer-info" style={{ color: "black" }}>
            <p className="coupon-info-item">
              <strong>NAME:</strong> {selectedTrainer.nickname}
            </p>
            <p className="coupon-info-item">
              <strong>GYM:</strong> {selectedTrainer.gymName}
            </p>
            <p className="coupon-info-item">
              <strong>COUPON:</strong> {selectedTrainer.coupons}
            </p>
            <p className="coupon-info-item">
              <strong>TIMES:</strong> {selectedTrainer.times}
            </p>
            <Button className="coupon-use-button" onClick={useCoupon}>
              쿠폰사용하기
            </Button>
          </div>
        ) : (
          <div className="coupon-loading">데이터를 로드하는 중입니다...</div>
        )}
      </div>
    </>
  ) : (
    <div>데이터를 로드하는 중입니다...</div>
  );
};

export default CouponComponent;
