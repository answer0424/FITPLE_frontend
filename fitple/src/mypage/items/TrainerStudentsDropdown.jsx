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

  const getAccessToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
  };

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

  useEffect(() => {
    if (selectedStudentId === "all") {
      setSelectedUser(null);
      setSelectedStudent([]);
    } else {
      const student = studentList.find(
        (s) => s.userId === parseInt(selectedStudentId)
      );
      setSelectedUser(student || null);
    }
  }, [selectedStudentId, studentList, setSelectedUser]);

  const handleMemberSelect = async (selectedId) => {
    setSelectedStudentId(selectedId);
    if (selectedId === "all") {
      console.log("🔄 전체 회원 일정 로드 중...");
      setSelectedUser(null);
      setSelectedStudent([]);
      try {
        const response = await axios.get(
          `http://localhost:8081/member/${trainerId}/calendar`,
          {
            params: { year, month },
            withCredentials: true,
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          }
        );
        updateEvents(response.data);
        console.log(
          "########트레이너의 이달일정 dropdowncopo : ",
          response.data
        );
      } catch (error) {
        console.error("❌ 전체 회원 일정 조회 실패:", error);
      }
      return;
    }
    try {
      const student = studentList.find(
        (s) => s.userId.toString() === selectedId
      );
      if (!student) return;
      const response = await axios.get(
        `http://localhost:8081/member/${trainerId}/calendar/student/${selectedId}`,
        {
          params: { year, month },
          withCredentials: true,
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );
      if (!response.data || response.data.length === 0) {
        alert("트레이닝이 없습니다");
        handleMemberSelect("all");
        return;
      }
      console.log("✅ 선택한 회원의 일정: ", response.data);
      setSelectedUser(student);
      setSelectedStudent(response.data);
      updateEvents(response.data);
    } catch (error) {
      console.error("❌ 일정 조회 실패:", error);
    }
  };

  if (isLoading)
    return (
      <Form.Select disabled>
        <option>로딩 중...</option>
      </Form.Select>
    );

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
