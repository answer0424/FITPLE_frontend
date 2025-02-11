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
      <Card
        className="event-item"
        style={{ color: "black" }}
        onClick={openModal}
      >
        <Card.Body className="event-body">
          <div className="event-left">
            <div className="profile-placeholder"></div>
            <div>
              <Card.Title className="nickname">
                {event.nickname} 회원님
              </Card.Title>
            </div>
          </div>
          <div className="event-right">
            {event.status === "운동완료" ? (
              <Button className="status-button" onClick={openModal}>
                완료됨
              </Button>
            ) : null}
            <span className="event-time">
              {new Date(event.date).toLocaleTimeString()}
            </span>
          </div>
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={isModalOpen} onHide={closeModal} centered>
        <Modal.Header>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          {`Date: ${new Date(event.date).toLocaleString()} | Nickname: ${
            event.nickname
          } | Reservation ID: ${event.reservationId} | User ID: ${
            event.userId
          }`}

          {authority.isTrainer ? (
            <TrainerButtonItem event={event} />
          ) : (
            <>
              {event.status === "운동끝" ? (
                <Button
                  onClick={() => changeStatus(event.reservationId, "운동완료")}
                >
                  운동 끝
                </Button>
              ) : (
                <p>status: {event.status}</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DailyItem;
