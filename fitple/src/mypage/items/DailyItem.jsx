import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Card } from "react-bootstrap";
import api from "../../mainpage/apis/api";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";
import TrainerButtonItem from "../items/TrainerButtonItem";
import "../static/css/DailyItem.css"; // CSS 파일 추가

const DailyItem = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { authority } = useContext(LoginContext);

  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const changeStatus = (reservationId, status) => {
    api
      .patch(
        "/member/schedule",
        { reservationId, status },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("팝업 정해지면 수정");
        console.log(response.status);
      });
  };

  useEffect(() => {
    console.log(api.defaults.baseURL + "/member/schedule");
  }, []);

  return (
    <>
      <Card className="daily-item-card" onClick={openModal}>
        <Card.Body className="daily-item-body">
          <div className="daily-item-left">
            <div className="daily-profile-placeholder"></div>
            <div>
              <Card.Title className="daily-nickname" style={{ color: "black" }}>
                {event.nickname} 회원
              </Card.Title>
            </div>
          </div>
          <div className="daily-item-right">
            {event.status === "운동완료" ? (
              <Button className="daily-status-button" onClick={openModal}>
                완료됨
              </Button>
            ) : null}
            <span className="daily-time">
              {new Date(event.date).toLocaleTimeString()}
            </span>
          </div>
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={isModalOpen} onHide={closeModal} centered>
        <Modal.Header className="daily-modal-header">
          <Modal.Title>일정 상세</Modal.Title>
        </Modal.Header>
        <Modal.Body className="daily-modal-body" style={{ color: "black" }}>
          <p>
            <strong>DATE :</strong> {new Date(event.date).toLocaleDateString()}{" "}
            (
            {new Date(event.date).toLocaleDateString("ko-KR", {
              weekday: "long",
            })}
            )
          </p>

          <strong>{event.nickname} 회원님</strong>

          {authority.isTrainer ? (
            <TrainerButtonItem event={event} />
          ) : (
            <>
              {event.status === "운동끝" ? (
                <Button
                  className="daily-end-button"
                  onClick={() => changeStatus(event.reservationId, "운동완료")}
                >
                  운동 끝
                </Button>
              ) : (
                <strong>{event.status}</strong>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="daily-modal-footer">
          <Button
            variant="secondary"
            className="daily-close-button"
            onClick={closeModal}
          >
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DailyItem;
