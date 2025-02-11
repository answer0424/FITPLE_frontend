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

// 🏋️‍♂️ 운동 상태 변경 버튼 컴포넌트
const TrainerButtonItem = ({ event }) => {
  const [canComplete, setCanComplete] = useState(false);
  const [exerciseStartTime, setExerciseStartTime] = useState(
    localStorage.getItem("exerciseStartTime") // 🔥 초기값을 localStorage에서 불러오기
  );

  // 🕒 운동 시작 시간 체크 (30초 후 운동 완료 가능)
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

  // 🏃‍♂️ 운동 시작
  const handleExerciseStart = () => {
    const startTime = new Date().toISOString(); // ISO 형식으로 저장
    localStorage.setItem("exerciseStartTime", startTime); // 🔥 localStorage에 저장
    setExerciseStartTime(startTime);
    changeStatus(event.reservationId, "운동중");
  };

  // ✅ 운동 완료
  const handleExerciseComplete = () => {
    if (!canComplete) {
      alert("운동 시작 후 30초가 지나야 완료할 수 있습니다.");
      return;
    }
    localStorage.removeItem("exerciseStartTime"); // 🧹 완료 후 localStorage에서 삭제
    changeStatus(event.reservationId, "운동완료");
  };

  // ❌ 운동 취소
  const handleExerciseCancel = () => {
    if (window.confirm("운동을 취소하시겠습니까?")) {
      localStorage.removeItem("exerciseStartTime"); // 🧹 취소 후 localStorage에서 삭제
      changeStatus(event.reservationId, "운동취소");
    }
  };

  // 🛑 운동 완료 또는 취소된 경우, 상태만 출력
  if (event.status === "운동완료" || event.status === "운동취소") {
    return <p>Status: {event.status}</p>;
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
      {exerciseStartTime || event.status === "운동중" ? (
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
      ) : (
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
