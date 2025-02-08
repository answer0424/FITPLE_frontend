import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import RegisterScheduleModal from "../modal/RegisterSceduleModal";
import DailyItem from "../items/DailyItem";

const DailyScheduleModal = ({
  isModalOpen,
  closeModal,
  selectedDate,
  dailyEvents,
  user,
}) => {
  const [modalChange, setModalChange] = useState(true);
  const [timeInput, setTimeInput] = useState("");

  //모달 변경
  const handleModalChange = () => {
    setModalChange((prev) => !prev);
  };
  //모달 닫히면 스케줄 창 보여주도록 변경
  useEffect(() => {
    if (!isModalOpen) setModalChange(true);
    setTimeInput("");
  }, [isModalOpen]);

  return (
    <Modal show={isModalOpen} onHide={closeModal} centered>
      <Modal.Header>
        <Modal.Title>{modalChange ? "스케줄" : "일정 등록"}</Modal.Title>
        {/* authority가 트레이너인 경우 보여지는 모달화면입니다. */}
        {user.authority === "ROLE_TRAINER" ? (
          <Button variant="primary" onClick={handleModalChange}>
            {modalChange ? "일정 추가" : "스케줄"}
          </Button>
        ) : (
          <div></div>
        )}
      </Modal.Header>
      <Modal.Body>
        {!user ? (
          <div className="text-center">잠시만 기다리세요...</div>
        ) : modalChange ? (
          dailyEvents.length > 0 ? (
            dailyEvents.map((event, index) => (
              <DailyItem event={event} key={index} />
            ))
          ) : (
            <div className="text-center">일정이 없습니다.</div>
          )
        ) : (
          <RegisterScheduleModal
            isModalOpen={isModalOpen}
            closeModal={() => {
              handleModalChange(); // 스케줄 화면으로 전환
              closeModal(); // 모달 닫기
            }}
            selectedDate={selectedDate}
            timeInput={timeInput}
            setTimeInput={setTimeInput}
            user={user}
          />
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DailyScheduleModal;
