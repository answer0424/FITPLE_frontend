import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  ListGroup,
  Spinner,
  Alert,
  Button,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import "../static/css/StudentsList.css"; // CSS 파일 import
import SearchStudentItem from "../items/SerchStudentItem";

const StudentsList = ({ user }) => {
  const [studentList, setStudentList] = useState([]); // 전체 데이터
  const [displayList, setDisplayList] = useState([]); // 렌더링할 데이터
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8); // 한 번에 보여줄 개수
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가
  const observer = useRef();

  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  // 전체 학생 목록 불러오기
  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:8081/member/${user.id}/register`, // 전체 데이터 한 번에 가져옴
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.status === 200 && response.data.length > 0) {
          console.log("전체 회원 리스트:", response.data);
          setStudentList(response.data);
          setDisplayList(response.data.slice(0, visibleCount)); // 초기 렌더링
        } else {
          setStudentList([]);
          setDisplayList([]);
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
  }, [user]);

  // 마지막 요소 감지하여 더 보여줌
  const lastStudentRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          displayList.length < studentList.length
        ) {
          setTimeout(() => {
            setVisibleCount((prev) => prev + 8); // 8개씩 추가
            setDisplayList(studentList.slice(0, visibleCount + 8));
          }, 500);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, displayList, studentList, visibleCount]
  );

  // 회원 추가 함수
  const addMember = (studentId, nickname, times) => {
    if (studentList.some((student) => student.userId === studentId)) {
      alert("이미 존재하는 회원입니다.");
      return;
    }
    const newStudent = { userId: studentId, nickname, times };
    setStudentList((prev) => [...prev, newStudent]);
    setDisplayList((prev) => [...prev, newStudent]);
  };

  return (
    <div className="students-container">
      {error && <Alert variant="danger">{error}</Alert>}
      <ListGroup className="students-list">
        {displayList.length > 0 ? (
          displayList.map((student, index) => (
            <Card
              key={student.userId}
              className="student-card"
              ref={index === displayList.length - 1 ? lastStudentRef : null} // 마지막 요소 감지
            >
              <div className="student-info">
                <img
                  src={`${import.meta.env.VITE_Server}/${student.profileImage}`}
                  alt="profile"
                  className="profile-img"
                />
                <div>
                  <h5>{student.nickname} 회원님</h5>
                  <p className="description"> 남은 횟수 : {student.times}</p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Alert variant="secondary" className="text-center">
            등록된 회원이 없습니다.
          </Alert>
        )}
      </ListGroup>
      {isLoading && <Spinner animation="border" />}

      <Button
        variant="dark"
        onClick={() => setShowModal(true)}
        style={{ width: "100px" }}
      >
        회원 등록
      </Button>

      {showModal && (
        <SearchStudentItem
          showModal={showModal}
          onClose={() => setShowModal(false)}
          user={user}
          onRegister={addMember}
        />
      )}
    </div>
  );
};

export default StudentsList;
