import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Card } from "react-bootstrap";
import api from "../../mainpage/apis/api";
import { Trash } from "react-bootstrap-icons";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";
import TrainerButtonItem from "../items/TrainerButtonItem";
import "../static/css/DailyItem.css"; // CSS 파일 추가

const DailyItem = ({ event, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 리렌더링을 하기위한 가짜 useState를 만든다.
  const { authority } = useContext(LoginContext);
  const [isCompleted, setIsCompleted] = useState(false);

  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (event) {
      console.log("현재 일정 정보:", {
        reservationId: event.reservationId,
        전체_이벤트_데이터: event,
      });
    }
  }, [event]);

  // ✅ 일정 삭제 함수 추가
  const handleDelete = async (reservationId) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const response = await api.delete(
        `/member/calendar/delete-schedule/${reservationId}`,
        {
          withCredentials: true,
          data: reservationId, // Long 값 전송
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("삭제 요청 ID:", reservationId);
      console.log("삭제 응답:", response);
      if (response.status === 200) {
        alert("일정이 삭제되었습니다.");
        setIsCompleted(true);
        console.log("삭제 요청 ID:", reservationId);

        onDelete(reservationId); // 삭제 후 리스트 업데이트
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        alert("운동이 완료되셨습니다 stamp가 1 증가합니다.");
        // useState값을 1 -> null 을 왔다갔다하면 서  리랜더링을 강제로 시킨다.
        // 운동완료 버튼 disable처리
        setIsCompleted(true);
        console.log("팝업 정해지면 수정");
        console.log(response.status);
      });
  };

  useEffect(() => {
    console.log(api.defaults.baseURL + "/member/schedule");
  }, [changeStatus]);

  return (
    <>
      <Card className="daily-item-card" onClick={openModal}>
        <Card.Body className="daily-item-body">
          <div className="daily-item-left">
            <div className="daily-profile-placeholder"></div>
            <div>
              <Card.Title className="daily-nickname" style={{ color: "black" }}>
                {event.nickname}{" "}
                {event.authority === "ROLE_TRAINER" ? " 트레이너" : " 회원"}
              </Card.Title>
            </div>
          </div>
          <div className="daily-item-right">
            {event.status === "운동완료" ? (
              <Button className="daily-status-button" onClick={openModal}>
                완료
              </Button>
            ) : null}
            <span className="daily-time">
              {new Date(event.date).toLocaleTimeString()}
            </span>

            {/* 🗑 트레이너만 삭제 버튼 표시 */}
            {authority.isTrainer && (
              <Trash
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation(); // 모달 열리는 이벤트 방지
                  handleDelete(event.reservationId);
                }}
                style={{ cursor: "pointer", marginLeft: "10px", color: "red" }}
              />
            )}
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

          {authority.isTrainer ? (
            <TrainerButtonItem event={event} />
          ) : (
            <>
              {event.status === "운동끝" ? (
                <Button
                  className="daily-end-button"
                  onClick={(e) => {
                    e.stopPropagation(); // 이벤트 전파 방지
                    if (event.status === "운동완료") {
                      alert("이미 운동이 완료되었습니다.");
                      return;
                    }
                    changeStatus(event.reservationId, "운동완료");
                  }}
                  disabled={isCompleted}
                >
                  운동완료
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
