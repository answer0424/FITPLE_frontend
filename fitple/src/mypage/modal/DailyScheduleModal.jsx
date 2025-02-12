import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import RegisterScheduleModal from "../modal/RegisterSceduleModal";
import DailyItem from "../items/DailyItem";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";

const DailyScheduleModal = ({
  isModalOpen,
  closeModal,
  selectedDate,
  dailyEvents,
  setDailyEvents,
  user,
  selectedUser,
}) => {
  const [modalChange, setModalChange] = useState(true);
  const [timeInput, setTimeInput] = useState("");
  const { userInfo } = useContext(LoginContext);

  // 모달 변경
  const handleModalChange = () => {
    setModalChange((prev) => !prev);
  };

  // 모달 닫히면 스케줄 창 보여주도록 변경
  useEffect(() => {
    if (!isModalOpen) setModalChange(true);
    setTimeInput("");
  }, [isModalOpen]);

  // 선택된 유저 일정 필터링 - 수정된 부분
  const filteredEvents = React.useMemo(() => {
    if (!dailyEvents) return [];
    return selectedUser
      ? dailyEvents.filter(
          (event) =>
            event.userId === selectedUser.userId ||
            event.userId === String(selectedUser.userId)
        )
      : dailyEvents;
  }, [dailyEvents, selectedUser]);

  // 디버깅을 위한 콘솔 로그
  useEffect(() => {
    console.log("Selected User:", selectedUser);
    console.log("Daily Events:", dailyEvents);
    console.log("Filtered Events:", filteredEvents);
  }, [selectedUser, dailyEvents, filteredEvents]);

  return (
    <Modal show={isModalOpen} onHide={closeModal} centered>
      <Modal.Header>
        <Modal.Title>{modalChange ? "스케줄" : "일정 등록"}</Modal.Title>
        {userInfo.authority === "ROLE_TRAINER" && (
          <Button variant="primary" onClick={handleModalChange}>
            {modalChange ? "일정 추가" : "스케줄"}
          </Button>
        )}
      </Modal.Header>
      <Modal.Body style={{ color: "black" }}>
        {!userInfo ? (
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
              handleModalChange();
              closeModal();
            }}
            selectedDate={selectedDate}
            timeInput={timeInput}
            setTimeInput={setTimeInput}
            setDailyEvents={setDailyEvents}
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
