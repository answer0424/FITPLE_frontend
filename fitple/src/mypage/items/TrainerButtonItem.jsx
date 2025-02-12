import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import api from "../../mainpage/apis/api";

// 🛠 상태 변경 API 호출 함수
const changeStatus = async (reservationId, status) => {
  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  try {
    const response = await api.patch(
      "/member/schedule",
      { reservationId, status },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (response.status === 200) {
      alert(`운동 상태가 '${status}'로 변경되었습니다.`);
      window.location.reload();
    } else {
      alert("변경 실패하였습니다. 다시 시도해주세요.");
    }
  } catch (error) {
    console.error("운동 상태 변경 실패:", error);
    alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
  }
};

const TrainerButtonItem = ({ event }) => {
  const [canComplete, setCanComplete] = useState(false);
  const [exerciseStartTime, setExerciseStartTime] = useState(
    localStorage.getItem("exerciseStartTime")
  );
  const [isCompleted, setIsCompleted] = useState(event.status === "운동끝");

  useEffect(() => {
    if (exerciseStartTime) {
      const interval = setInterval(() => {
        const elapsedSeconds = Math.floor(
          (new Date() - new Date(exerciseStartTime)) / 1000
        );
        setCanComplete(elapsedSeconds >= 30);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [exerciseStartTime]);

  const handleExerciseStart = () => {
    const startTime = new Date().toISOString();
    localStorage.setItem("exerciseStartTime", startTime);
    setExerciseStartTime(startTime);
    changeStatus(event.reservationId, "운동중");
  };

  const handleExerciseComplete = () => {
    if (!canComplete) {
      alert("운동 시작 후 30초가 지나야 완료할 수 있습니다.");
      return;
    }
    setIsCompleted(true);
    localStorage.removeItem("exerciseStartTime");
    changeStatus(event.reservationId, "운동끝");
  };

  const handleExerciseCancel = () => {
    if (window.confirm("운동을 취소하시겠습니까?")) {
      localStorage.removeItem("exerciseStartTime");
      changeStatus(event.reservationId, "운동취소");
    }
  };

  // 운동이 완료되었거나 취소된 경우
  if (isCompleted || event.status === "운동끝" || event.status === "운동취소") {
    return (
      <div className="text-center p-2">
        <p className="mb-0">상태: {event.status}</p>
      </div>
    );
  }

  return (
    <div className="d-grid gap-2">
      {/* 운동 시작 전 */}
      {!exerciseStartTime && event.status !== "운동중" && (
        <Button
          variant="primary"
          onClick={handleExerciseStart}
          className="mt-2"
        >
          운동 시작
        </Button>
      )}

      {/* 운동 시작 후 */}
      {(exerciseStartTime || event.status === "운동중") && (
        <>
          <Button
            variant="success"
            onClick={handleExerciseComplete}
            disabled={!canComplete}
            className="mt-2"
          >
            운동 완료 {!canComplete && "(30초 후 가능)"}
          </Button>
          <Button
            variant="danger"
            onClick={handleExerciseCancel}
            className="mt-2"
          >
            운동 취소
          </Button>
        </>
      )}

      {/* 운동 시작 전 취소 버튼 */}
      {!exerciseStartTime && event.status !== "운동중" && (
        <Button
          variant="danger"
          onClick={handleExerciseCancel}
          className="mt-2"
        >
          운동 취소
        </Button>
      )}
    </div>
  );
};

export default TrainerButtonItem;
