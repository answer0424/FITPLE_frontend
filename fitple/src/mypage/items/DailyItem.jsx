import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../../mainpage/apis/api";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";
import TrainerButtonItem from "../items/TrainerButtonItem"; // 올바른 import

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
      <div className="event-item">
        <Button onClick={openModal}>
          {`Date: ${new Date(event.date).toLocaleString()} | Nickname: ${
            event.nickname
          } | Reservation ID: ${event.reservationId} | User ID: ${
            event.userId
          }`}
        </Button>
      </div>
      <Modal show={isModalOpen} onHide={closeModal} centered>
        <Modal.Header>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
