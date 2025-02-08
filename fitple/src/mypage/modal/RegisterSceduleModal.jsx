import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const RegisterScheduleModal = ({
  isModalOpen,
  closeModal,
  selectedDate,
  timeInput,
  setTimeInput,
  onScheduleUpdate,
  user,
}) => {
  const [studentList, setStudentList] = useState([]);
  const [trainingList, setTrainingList] = useState([]); // Training 정보를 저장할 상태 추가
  const [selectedStudent, setSelectedStudent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];
  // 날짜 형식을 "YYYY-MM-DD HH:mm:ss.SSSSSS"로 변환
  const formatToLocalDateTime = (date, time) => {
    const scheduleDateTime = new Date(date);
    const [hours, minutes] = time.split(":");
    scheduleDateTime.setHours(parseInt(hours), parseInt(minutes));

    return scheduleDateTime.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss" 형식 유지
  };

  useEffect(() => {
    const fetchStudents = async () => {
      if (!isModalOpen || !user?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        // 트레이너의 트레이닝 목록을 가져오는 API 호출
        const response = await axios.get(
          `http://localhost:8081/member/${user.id}/register`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (response.status === 200 && response.data) {
          console.log("가져온 트레이닝 목록:", response.data);
          setStudentList(response.data);
          // Training 정보도 함께 저장
          if (Array.isArray(response.data)) {
            const trainings = response.data.map((user) => ({
              // trainingId: user.trainingId, // Training 테이블의 ID
              studentId: user.userId, // User(Student) 테이블의 ID
              nickname: user.nickname,
              times: user.times,
              trainingId: user.trainingId,
            }));

            console.log("tranings : ", trainings);
            console.log("dd", trainings.studentId);
            setTrainingList(trainings);
          }
        } else {
          setStudentList([]);
          setError("학생 목록을 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("트레이너 유저 목록 불러오기 실패:", error);
        setError("학생 목록을 불러오는 중 오류가 발생했습니다.");
        setStudentList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [isModalOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !timeInput || !selectedDate) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // LocalDateTime 형식 변환 (YYYY-MM-DDTHH:mm:ss)
      const formattedDate = formatToLocalDateTime(selectedDate, timeInput);

      // 선택된 학생의 Training ID 찾기
      const selectedTraining = trainingList.find(
        (t) => t.studentId === parseInt(selectedStudent)
      );

      if (!selectedTraining) {
        throw new Error("선택된 학생의 트레이닝 정보를 찾을 수 없습니다.");
      }

      const scheduleData = {
        date: formattedDate, // "YYYY-MM-DDTHH:mm:ss" 형식 유지
        trainingId: selectedTraining.trainingId,
      };

      console.log("전송할 일정 데이터:", scheduleData);

      const response = await axios.post(
        `http://localhost:8081/member/register/add-schedule/${user.id}`,
        scheduleData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.status === 200) {
        console.log("일정 등록 성공:", response.data);
        alert("일정이 등록되었습니다");
        if (onScheduleUpdate) {
          onScheduleUpdate(scheduleData);
        }
        setSelectedStudent("");
        setTimeInput("");
        closeModal();
      }
    } catch (error) {
      console.error("일정 등록 실패:", error);
      setError(error.message || "일정 등록 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={isModalOpen} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>일정 추가</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>회원 선택</Form.Label>
            <Form.Select
              value={selectedStudent}
              onChange={(e) => {
                const selectedId = e.target.value;
                console.log("선택된 학생 ID:", selectedId);
                setSelectedStudent(selectedId);
              }}
              disabled={isLoading}
            >
              <option value="">회원 선택</option>
              {studentList.length > 0 ? (
                studentList.map((student) => (
                  <option
                    key={`student-${student.userId}`}
                    value={student.userId}
                  >
                    {student.nickname}
                  </option>
                ))
              ) : (
                <option key="no-students" disabled>
                  등록된 수강생 없음
                </option>
              )}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>트레이닝 시간</Form.Label>
            <Form.Control
              type="time"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>선택된 날짜</Form.Label>
            <Form.Control
              type="text"
              value={
                selectedDate
                  ? new Date(selectedDate).toLocaleDateString("ko-KR")
                  : ""
              }
              disabled
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={isLoading || !selectedStudent || !timeInput}
          >
            {isLoading ? "처리중..." : "일정 등록"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterScheduleModal;
