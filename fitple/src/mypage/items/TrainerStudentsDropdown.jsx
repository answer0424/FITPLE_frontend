import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";

const TrainerStudentsDropdown = ({
  trainerId,
  updateEvents,
  selectedUser,
  setSelectedUser,
  setSelectedStudent,
  year,
  month,
}) => {
  const [studentList, setStudentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState("all");

  // Get access token from cookies
  const getAccessToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
  };

  // Fetch student list
  useEffect(() => {
    const fetchStudents = async () => {
      if (!trainerId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:8081/member/${trainerId}/register`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          }
        );

        if (response.status === 200 && response.data.length > 0) {
          console.log("드롭다운 , 전체 회원 리스트:", response.data);
          setStudentList(response.data);
        } else {
          setStudentList([]);
          setError("학생 목록을 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("학생 목록 불러오기 실패:", error);
        setError("학생 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [trainerId]);

  // 선택된 학생 ID가 변경될 때 selectedUser 업데이트
  useEffect(() => {
    if (selectedStudentId === "all") {
      setSelectedUser(null);
      setSelectedStudent(null);
    } else {
      const student = studentList.find(
        (s) => s.userId === parseInt(selectedStudentId)
      );
      setSelectedUser(student || null);
    }
  }, [selectedStudentId, studentList, setSelectedUser]);

  // Handle student selection
  const handleMemberSelect = async (studentId) => {
    console.log("선택한 studentId : ", studentId);
    setSelectedStudentId(studentId);

    try {
      // 전체 회원 선택 시
      if (studentId === "all") {
        setSelectedUser("all");
        setSelectedStudent([]);
        updateEvents([]);
        return;
      }

      // 특정 회원 선택 시
      const selectedStudent = studentList.find(
        (s) => s.userId === parseInt(studentId)
      );
      setSelectedUser(selectedStudent || null);

      const selectedYear = year || new Date().getFullYear();
      const selectedMonth = month || new Date().getMonth() + 1;

      if (studentId === "all") {
        setSelectedStudent(null);
      } else {
        response = await axios.get(
          `http://localhost:8081/member/${trainerId}/calendar/student/${studentId}`,
          {
            params: { year: selectedYear, month: selectedMonth },
            withCredentials: true,
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          }
        );
        setSelectedStudent(response.data);
      }

      console.log(
        `${studentId === "all" ? "전체 회원" : studentId} 일정: `,
        response.data
      );
      updateEvents(response.data);
    } catch (error) {
      console.error("일정 조회 실패: ", error);
      setError("일정을 불러오는 중 오류가 발생했습니다.");
    }
  };

  if (isLoading)
    return (
      <Form.Select disabled>
        <option>로딩 중...</option>
      </Form.Select>
    );
  // if (error) return <div className="text-danger">{error}</div>;

  return (
    <Form.Select
      value={selectedStudentId}
      onChange={(e) => handleMemberSelect(e.target.value)}
    >
      <option value="all">전체 회원</option>
      {studentList.map((student) => (
        <option key={student.userId} value={student.userId}>
          {student.nickname}
        </option>
      ))}
    </Form.Select>
  );
};

export default TrainerStudentsDropdown;
