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
        console.log("response.data : ", response.data);
        if (!trainers) setTrainers(response.data.trainerIds);
        // stamp 10개 있어야만 coupons 1개
        setSelectedTrainer({
          stamp: reportError.data.stamp,
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

  useEffect(() => {
    if (selectedTrainer?.stamp === 10) {
      alert("축하합니다! 스탬프 10개를 달성하셨습니다!");
    }
  }, [selectedTrainer?.stamp]);

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
          stamp: response.data.stamp,
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
              <strong>Stamp:</strong> {selectedTrainer.stamp}
            </p>
            <p className="coupon-info-item">
              <strong>COUPON:</strong> {selectedTrainer.coupons}
            </p>
            <p className="coupon-info-item">
              <strong>TIMES:</strong> {selectedTrainer.times}
            </p>
            <div className="stamp-container">
              {[...Array(selectedTrainer.stamp)].map((_, index) => (
                <img
                  key={index}
                  src="../../src/common/img/stamp.png"
                  alt="Stamp"
                  className="stamp-icon"
                  style={{ width: "15vh" }}
                />
              ))}
            </div>
            <Button className="coupon-use-button" onClick={useCoupon}>
              쿠폰사용하기
            </Button>
          </div>
        ) : (
          <div className="coupon-loading">트레이너를 선택해주세요</div>
        )}
      </div>
    </>
  ) : (
    <div> 트레이너를 추가해주세요</div>
  );
};

export default CouponComponent;
