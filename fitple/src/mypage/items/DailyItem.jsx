import React, { useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from '../../mainpage/apis/api';

const DailyItem = (event, key) => {

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태

  const openModal = (event) => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return(
    <>
    <div className="event-item">
      <Button onClick={openModal}>
        {`Date: ${new Date(event.event.date).toLocaleString()} | Nickname: ${event.event.nickname} | Reservation ID: ${event.event.reservationId} | User ID: ${event.event.userId}`}
      </Button>
    </div>
    <Modal show={isModalOpen} onHide={closeModal} centered>
        <Modal.Header>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {`Date: ${new Date(event.event.date).toLocaleString()} | Nickname: ${event.event.nickname}| Reservation ID: ${event.event.reservationId} | User ID: ${event.event.userId}`}

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
